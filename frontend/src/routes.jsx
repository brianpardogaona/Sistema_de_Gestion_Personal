import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import MisMetas from "./pages/MisMetas";
import MiCuenta from "./pages/MiCuenta"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/mis-metas" element={<MisMetas />} />
      <Route path="/mi-cuenta" element={<MiCuenta />} />
    </Routes>
  );
}

export default App;
