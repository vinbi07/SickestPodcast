# End of Season Party RSVPs: Google Sheets Setup

The RSVP form at `/end-of-season-party` posts to `POST /api/party-rsvp`. That Route Handler validates the submission on the server, checks the sheet for a duplicate email, and appends one row to a Google Sheet. It authenticates with a **Google Cloud service account**. The browser never talks to Google, and no credential is ever sent to the client.

You need three values: `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY`. `GOOGLE_SHEET_TAB` is optional.

---

## 1. Create or select a Google Cloud project

1. Go to <https://console.cloud.google.com/>.
2. In the project picker at the top, choose an existing project or click **New Project**. Name it something like `sickest-podcast`, then click **Create**.
3. Make sure that project is selected in the picker before you continue.

## 2. Enable the Google Sheets API

1. Open **APIs & Services → Library**.
2. Search for **Google Sheets API**, open it, and click **Enable**.

## 3. Create a service account

1. Open **IAM & Admin → Service Accounts** and click **+ Create service account**.
2. Name it `sickest-rsvp-writer`. The ID is filled in automatically. Click **Create and continue**.
3. Skip **Grant this service account access to project**, because no project roles are needed. Click **Continue**, then **Done**.
4. Copy the service account's **email**. It looks like `sickest-rsvp-writer@<project-id>.iam.gserviceaccount.com`.

## 4. Create and download a JSON key

1. Click the new service account and open the **Keys** tab.
2. Click **Add key → Create new key**, choose **JSON**, and click **Create**. A `.json` file downloads.
3. Keep this file private. **Never commit it.** You need two fields from it:
   - `client_email`, which goes in `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key`, which goes in `GOOGLE_PRIVATE_KEY`

> If your organization blocks key creation (the "Disable service account key creation" policy), an org admin must allow it for this project.

## 5. Create the RSVP Google Sheet

1. Go to <https://sheets.google.com> and create a blank spreadsheet, for example **Sickest Podcast – Party RSVPs**.
2. Rename the tab at the bottom (double-click `Sheet1`) to exactly:

   ```
   End of Season Party RSVPs
   ```

   To use a different tab name, set `GOOGLE_SHEET_TAB` to that name.
3. Paste this header row into **row 1**, starting at cell **A1**. It is tab-separated, so it fills A1 through K1 automatically:

   ```
   Timestamp	First Name	Last Name	Email	Phone	RSVP Status	Guest Count	Notes	Source	Show on Guest List	Dietary Restrictions
   ```

   | A | B | C | D | E | F | G | H | I | J | K |
   |---|---|---|---|---|---|---|---|---|---|---|
   | Timestamp | First Name | Last Name | Email | Phone | RSVP Status | Guest Count | Notes | Source | Show on Guest List | Dietary Restrictions |

   The app treats row 1 as headers. It never writes to row 1 and only appends below it. The duplicate check reads column **D** from row 2 down, so keep emails in column D.
4. Optional: select row 1 and choose **View → Freeze → 1 row**.

## 6. Copy the Spreadsheet ID

The ID is the long string between `/d/` and `/edit` in the sheet URL:

```
https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789/edit#gid=0
                                       └──────────── GOOGLE_SHEET_ID ────────────┘
```

## 7. Share the sheet with the service account as an Editor

1. In the sheet, click **Share**.
2. Paste the service account email from step 3.
3. Set the role to **Editor**, uncheck **Notify people**, and click **Share**.

If you skip this step, submissions fail with a permission error. Users only see the generic "We couldn't complete your registration" message, and the server log shows `Google Sheets permission error (HTTP 403)`.

## 8. Add the environment variables locally

Create `.env.local` in the project root. It is already git-ignored.

```bash
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789
GOOGLE_SERVICE_ACCOUNT_EMAIL=sickest-rsvp-writer@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...lots of characters...\n-----END PRIVATE KEY-----\n"
# Optional, defaults to "End of Season Party RSVPs"
# GOOGLE_SHEET_TAB=End of Season Party RSVPs
```

For `GOOGLE_PRIVATE_KEY`, copy the `private_key` value from the JSON file **exactly as it appears there**, all on one line with the literal `\n` sequences, and wrap it in double quotes. The server turns `\n` into real line breaks at runtime.

Restart `npm run dev` after editing `.env.local`.

> Do **not** prefix any of these with `NEXT_PUBLIC_`. That prefix would ship them to the browser.

## 9. Add the same variables to Vercel

1. Vercel dashboard → your project → **Settings → Environment Variables**.
2. Add each variable (`GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and optionally `GOOGLE_SHEET_TAB`) for **Production**, and for **Preview** too if you want previews to write to the sheet.
3. For `GOOGLE_PRIVATE_KEY`, paste the value **without** the surrounding double quotes. Either the single-line `\n`-escaped form or a multi-line PEM works, because the app handles both.
4. Redeploy (**Deployments → ⋯ → Redeploy**). Environment variable changes only apply to new deployments.

Consider pointing Preview at a separate test sheet so test RSVPs don't mix with real ones.

## 10. Test a registration

1. Open `http://localhost:3000/end-of-season-party`, or your deployed URL.
2. Choose **Yes, I'll be there**, fill in the form, and submit. You should see **"You're on the list."**
3. Submit again with the **same email** in different casing or with extra spaces. You should see **"Looks like you've already registered for the End of Season Party."** and no new row should appear.
4. Submit with a different email and choose **Unable to attend**. You should see **"Thanks for letting us know."**

## 11. Confirm the rows in the spreadsheet

You should see one new row per successful submission, for example:

| Timestamp | First Name | Last Name | Email | Phone | RSVP Status | Guest Count | Notes | Source | Show on Guest List | Dietary Restrictions |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-01 2:05:12 PM CDT | Jordan | Lee | jordan@example.com | (214) 555-0100 | Attending | 2 | Excited! | Sickest Podcast Website | Yes | Vegetarian; guest has a nut allergy |
| 2026-10-01 2:07:40 PM CDT | Sam | Rivera | sam@example.com | 214-555-0199 | Unable to Attend | 0 | | Sickest Podcast Website | No | |

- **Timestamp** is generated on the server in Dallas time (America/Chicago).
- **Email** is stored trimmed and lowercased.
- **Guest Count** is 1–2 for attendees and 0 for declines.
- **Source** is always `Sickest Podcast Website` and is set by the server.
- **Show on Guest List** is `Yes` only when an attendee left the opt-in checkbox checked. Declines are always `No`.
- **Dietary Restrictions** is optional, attendees only (up to 200 characters), and covers the registrant and their +1. It is never shown publicly.
- Values are written with `RAW` input, so text like `=SUM(...)` is stored as plain text and never runs as a formula.

---

## 12. The public guest list

The RSVP section shows a **Who's Going** panel, loaded from `GET /api/party-rsvp/guests`:

- **Headcount:** the sum of **Guest Count** for every `Attending` row, including +1s and people who chose not to show their name.
- **Names:** the **first name only** of attending rows where column J is exactly `Yes`. The endpoint never returns last names, emails, phones, or notes.
- **Hiding someone:** change their column J cell to `No`. Rows with a blank J, including any saved before this column existed, are never shown.
- **Removing an RSVP:** delete the row. Both the count and the list update.
- **Delay:** changes appear within about a minute (60 s server cache plus a 30 s CDN cache).
- **If Google is unreachable:** the panel hides itself and the rest of the page keeps working.

## Troubleshooting

Users always see a generic message. The real cause is in the server logs (Vercel → **Logs**), which start with `[party-rsvp]`. The logs never include keys, sheet IDs, or Google response bodies.

| Log / HTTP status | Cause | Fix |
|---|---|---|
| `config error` → 503 | A variable is missing, or the private key isn't a PEM | Check all three variables are set for this environment, then redeploy |
| `config error: Unable to sign JWT` | The private key is malformed or truncated | Re-copy `private_key` from the JSON file in full |
| `auth error (HTTP 400/401)` | Wrong service account email, or the key was deleted or rotated | Make sure the email and key come from the same JSON file |
| `permission error (HTTP 403)` | The sheet isn't shared with the service account, or the Sheets API isn't enabled | Repeat steps 2 and 7 |
| `not_found error (HTTP 404)` | Wrong `GOOGLE_SHEET_ID` | Re-copy it from the URL (step 6) |
| `not_found error (HTTP 400)` | The tab name doesn't match | Rename the tab or set `GOOGLE_SHEET_TAB` |
| `unavailable error` → 502 | A Google outage, timeout, or network issue | Temporary; the user can retry |
| 429 | More than 5 submissions from one IP in 10 minutes | Expected abuse protection |

## Abuse protection notes

- The request body is capped at 8 KB and Notes at 500 characters. All fields are validated again on the server.
- A hidden honeypot field silently drops bot submissions.
- Rate limiting is **in-memory per server instance** (5 per IP per 10 min). On Vercel it slows bursts but is not a global limit. If abuse becomes a real problem, move it to a shared store such as Vercel KV or Upstash, or turn on Vercel's Firewall rate-limiting rules.
- The duplicate check reads the sheet and then appends. Two submissions with the same email in the same instant could both get through. At this form's volume that is very unlikely; if it happens, delete the extra row by hand.
