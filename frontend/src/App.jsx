import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import People from "./People";

function App() {
  return (
    <div>
      <nav style={{ padding: "10px", display: "flex", gap: "10px" }}>
        <Link to="/">Home</Link>
        <Link to="/people">People</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/people" element={<People />} />
      </Routes>
    </div>
  );
}

export default App;