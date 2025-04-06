import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import MisMetas from "./pages/MisMetas";
import MiCuenta from "./pages/MiCuenta";
import Agenda from "./pages/Agenda";
import Register from "./pages/Register";
import CrearMeta from "./pages/CrearMeta";
import EditarMeta from "./pages/EditarMeta";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/mis-metas" element={<MisMetas />} />
      <Route path="/mi-cuenta" element={<MiCuenta />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/register" element={<Register />} />
      <Route path="/crear-meta" element={<CrearMeta />} />
      <Route path="/editar-meta/:id" element={<EditarMeta />} />
    </Routes>
  );
}

export default App;
