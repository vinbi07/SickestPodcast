/**
 * Minimal server-side Google Sheets client (service-account JWT + Sheets REST v4).
 * Server-only: depends on node:crypto and secret env vars. Never import from a
 * client component. Errors are categorized and never carry credentials, sheet IDs,
 * or raw Google response bodies.
 */
import { createSign } from 'node:crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const REQUEST_TIMEOUT_MS = 10_000;

export const DEFAULT_SHEET_TAB = 'End of Season Party RSVPs';

export type SheetsErrorKind = 'config' | 'auth' | 'permission' | 'not_found' | 'unavailable';

export class SheetsError extends Error {
  constructor(
    public readonly kind: SheetsErrorKind,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'SheetsError';
  }
}

interface SheetsConfig {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
  tab: string;
}

export function getSheetsConfig(): SheetsConfig {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const tab = process.env.GOOGLE_SHEET_TAB?.trim() || DEFAULT_SHEET_TAB;

  if (!spreadsheetId || !clientEmail || !rawKey) {
    throw new SheetsError('config', 'Missing Google Sheets environment variables.');
  }

  // Vercel / .env files commonly store the PEM with literal "\n" sequences and
  // sometimes wrapping quotes; normalize both.
  const privateKey = rawKey
    .trim()
    .replace(/^"([\s\S]*)"$/, '$1')
    .replace(/\\n/g, '\n');

  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new SheetsError('config', 'GOOGLE_PRIVATE_KEY is not a PEM private key.');
  }

  return { spreadsheetId, clientEmail, privateKey, tab };
}

let cachedToken: { value: string; expiresAt: number; clientEmail: string } | null = null;

function base64Url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

async function timedFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), cache: 'no-store' });
  } catch {
    throw new SheetsError('unavailable', 'Network error contacting Google.');
  }
}

async function getAccessToken(config: SheetsConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.clientEmail === config.clientEmail && cachedToken.expiresAt - 60 > now) {
    return cachedToken.value;
  }

  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64Url(
    JSON.stringify({ iss: config.clientEmail, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  );

  let signature: string;
  try {
    signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(config.privateKey, 'base64url');
  } catch {
    throw new SheetsError('config', 'Unable to sign JWT with GOOGLE_PRIVATE_KEY.');
  }

  const response = await timedFetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    }),
  });

  if (!response.ok) {
    throw new SheetsError(
      response.status >= 500 ? 'unavailable' : 'auth',
      'Google token exchange failed.',
      response.status,
    );
  }

  const body = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) {
    throw new SheetsError('auth', 'Google token response missing access_token.');
  }

  cachedToken = { value: body.access_token, expiresAt: now + (body.expires_in ?? 3600), clientEmail: config.clientEmail };
  return body.access_token;
}

function classify(status: number): SheetsError {
  if (status === 401) {
    cachedToken = null;
    return new SheetsError('auth', 'Google rejected the access token.', status);
  }
  if (status === 403) return new SheetsError('permission', 'Service account lacks access to the spreadsheet.', status);
  if (status === 404) return new SheetsError('not_found', 'Spreadsheet not found.', status);
  // 400 here almost always means the tab name in the range does not exist.
  if (status === 400) return new SheetsError('not_found', 'Sheet tab or range not found.', status);
  return new SheetsError('unavailable', 'Google Sheets request failed.', status);
}

function quotedRange(tab: string, a1: string): string {
  return `'${tab.replace(/'/g, "''")}'!${a1}`;
}

async function sheetsRequest(config: SheetsConfig, path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken(config);
  const response = await timedFetch(`${SHEETS_BASE}/${encodeURIComponent(config.spreadsheetId)}${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw classify(response.status);
  return response;
}

/** Column D holds emails; row 1 is the header row and is skipped. */
export async function listRegisteredEmails(normalize: (value: string) => string): Promise<Set<string>> {
  const config = getSheetsConfig();
  const range = encodeURIComponent(quotedRange(config.tab, 'D2:D'));
  const response = await sheetsRequest(config, `/values/${range}?majorDimension=COLUMNS`);
  const body = (await response.json()) as { values?: string[][] };
  return new Set((body.values?.[0] ?? []).map((value) => normalize(String(value))).filter(Boolean));
}

/** All data rows (A2:J), header row skipped. Cells are returned as formatted strings. */
export async function readRows(): Promise<string[][]> {
  const config = getSheetsConfig();
  const range = encodeURIComponent(quotedRange(config.tab, 'A2:J'));
  const response = await sheetsRequest(config, `/values/${range}?majorDimension=ROWS`);
  const body = (await response.json()) as { values?: unknown[][] };
  return (body.values ?? []).map((row) => row.map((cell) => String(cell ?? '')));
}

export async function appendRow(values: (string | number)[]): Promise<void> {
  const config = getSheetsConfig();
  const range = encodeURIComponent(quotedRange(config.tab, 'A:M'));
  // RAW: values are stored exactly as sent (no formula evaluation).
  // INSERT_ROWS: always adds a new row after the table, never overwrites the header.
  await sheetsRequest(config, `/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ majorDimension: 'ROWS', values: [values] }),
  });
}
