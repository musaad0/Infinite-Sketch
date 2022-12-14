import { Routes, Route } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import Home from './pages/Home/Home';
import Player from './pages/Player/Player';
import SharedLayout from './pages/SharedLayout/SharedLayout';
import './App.css';
import ContextMenu from './components/ContextMenu';

export default function App() {
  return (
    <div className="select-none">
      <ContextMenu />
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route
            index
            element={
              <Transition
                enter="transition-opacity ease-linear duration-300"
                show
                appear
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Home />
              </Transition>
            }
          />
          <Route path="player" element={<Player />} />
        </Route>
      </Routes>
    </div>
  );
}
