import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Player from './pages/Player';
import SharedLayout from './pages/SharedLayout';
import { PlayerProvider } from './context/PlayerContext';
import './App.css';

export default function App() {
  const [interval, setInterval] = useState(30);

  useEffect(() => {
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      api.menu();
    });
  }, []);

  return (
    <>
      <PlayerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SharedLayout />}>
              <Route index element={<Home />} />
              <Route path="player" element={<Player />} />
            </Route>
          </Routes>
        </Router>
      </PlayerProvider>
    </>
  );
}
