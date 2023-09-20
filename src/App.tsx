import { Route, Routes } from "react-router-dom";
import { MemoryRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Home from "@/pages/Home/Home";
import { Player } from "@/pages/Player/Player";

import { ToastContainer } from "@/components";

function App() {
  return (
    <div>
      <ToastContainer />
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
