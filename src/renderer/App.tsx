import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';
import Home from './pages/Home/Home';
import Player from './pages/Player/Player';
import SharedLayout from './pages/SharedLayout/SharedLayout';
import './App.css';

export default function App() {
  return (
    <div className="select-none">
      <RecoilRoot>
        <Router>
          <Routes>
            <Route path="/" element={<SharedLayout />}>
              <Route index element={<Home />} />
              <Route path="player" element={<Player />} />
            </Route>
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  );
}
