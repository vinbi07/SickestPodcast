'use client';

import { useEffect, useId, useState } from 'react';
import type { GuestList as GuestListData, PublicGuest } from '../../lib/party-rsvp/guest-list';
import styles from './GuestList.module.css';

export interface SelfGuest {
  firstName: string;
  plus: number;
  shown: boolean;
}

interface GuestListProps {
  /** The current visitor's RSVP, merged in locally so it shows immediately. */
  self: SelfGuest | null;
}

const COLLAPSED_COUNT = 10;
const AVATAR_COUNT = 5;

type LoadState = { status: 'loading' } | { status: 'ready'; data: GuestListData } | { status: 'hidden' };

export default function GuestList({ self }: GuestListProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/party-rsvp/guests', { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: (GuestListData & { available?: boolean }) | null) => {
        if (!body?.available || typeof body.going !== 'number' || !Array.isArray(body.guests)) {
          setState({ status: 'hidden' });
          return;
        }
        setState({ status: 'ready', data: { going: body.going, guests: body.guests } });
      })
      .catch((error: unknown) => {
        if ((error as Error)?.name !== 'AbortError') setState({ status: 'hidden' });
      });
    return () => controller.abort();
  }, []);

  if (state.status === 'hidden') return null;

  if (state.status === 'loading') {
    return <div className={`${styles.block} ${styles.skeleton}`} aria-hidden="true" />;
  }

  const going = state.data.going + (self ? 1 + self.plus : 0);
  const guests: (PublicGuest & { isSelf?: boolean })[] =
    self?.shown ? [{ firstName: self.firstName, plus: self.plus, isSelf: true }, ...state.data.guests] : state.data.guests;
  const hiddenCount = Math.max(guests.length - COLLAPSED_COUNT, 0);
  const visible = expanded ? guests : guests.slice(0, COLLAPSED_COUNT);

  return (
    <section className={styles.block} aria-labelledby={`${listId}-title`}>
      <div className={styles.header}>
        <h3 id={`${listId}-title`} className={styles.title}>
          Who&apos;s Going
        </h3>
        {guests.length > 0 ? (
          <div className={styles.avatars} aria-hidden="true">
            {guests.slice(0, AVATAR_COUNT).map((guest, index) => (
              <span key={`${guest.firstName}-${index}`} className={guest.isSelf ? styles.avatarSelf : undefined}>
                {guest.firstName.charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <p className={styles.count} aria-live="polite">
        {going > 0 ? (
          <>
            <strong>{going}</strong> {going === 1 ? 'person is' : 'people are'} going
          </>
        ) : (
          <>Be the first on the list.</>
        )}
      </p>

      {guests.length > 0 ? (
        <>
          <ul id={listId} className={styles.names}>
            {visible.map((guest, index) => (
              <li key={`${guest.firstName}-${index}`} className={guest.isSelf ? styles.self : undefined}>
                {guest.isSelf ? `${guest.firstName} (you)` : guest.firstName}
                {guest.plus > 0 ? <span className={styles.plus}> +{guest.plus}</span> : null}
              </li>
            ))}
          </ul>
          {hiddenCount > 0 ? (
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={expanded}
              aria-controls={listId}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? 'Show less' : `+${hiddenCount} more`}
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
