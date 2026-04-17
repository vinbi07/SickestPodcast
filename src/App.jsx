import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import EpisodeDetailPage from './pages/EpisodeDetailPage';
import BookingPage from './pages/BookingPage';
import { pageVariants } from './motion/presets';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={pageVariants}
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/episodes/:id"
          element={
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={pageVariants}
            >
              <EpisodeDetailPage />
            </motion.div>
          }
        />
        <Route
          path="/booking"
          element={
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={pageVariants}
            >
              <BookingPage />
            </motion.div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}