# The Sickest Podcast (React)

Production-ready React + Vite implementation of the Sickest Podcast experience with reusable components, React Router, and a mock data layer.

## Tech

- React 18
- React Router 6
- Vite 5
- CSS Modules

## Routes

- `/` Home
- `/episodes/:id` Episode detail
- `/booking` Booking placeholder

## Data Layer

- `src/data/podcasts.js`
- `src/data/guests.js`

Only metadata and `videoUrl` values are stored. No video files are stored in the project.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## End of Season Party RSVP

- Page: `/end-of-season-party`
- API: `POST /api/party-rsvp` appends one row per RSVP to a Google Sheet (server-side only)
- Setup: see [docs/end-of-season-party-setup.md](docs/end-of-season-party-setup.md) for the Google Cloud, Sheet, and Vercel configuration
