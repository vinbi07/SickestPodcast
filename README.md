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
