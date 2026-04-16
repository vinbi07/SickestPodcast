import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EpisodeDetailPage from './pages/EpisodeDetailPage';
import BookingPage from './pages/BookingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/episodes/:id" element={<EpisodeDetailPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}