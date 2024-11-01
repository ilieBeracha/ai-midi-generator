import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Generate from "./views/MidiGenerate";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </div>
  );
}

export default App;
