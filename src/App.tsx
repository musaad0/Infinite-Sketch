import { Route, Routes } from "react-router-dom";
import { MemoryRouter as Router } from "react-router-dom";

import Home from "@/pages/Home/Home";
import { Player } from "@/pages/Player/Player";

import { Toaster } from "@/components";

import "./App.css";

function App() {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player" element={<Player />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
