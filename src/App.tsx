import { Routes, Route } from "react-router-dom";
import { MemoryRouter as Router } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components";
import Home from "@/pages/Home/Home";
import { Player } from "@/pages/Player/Player";

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
