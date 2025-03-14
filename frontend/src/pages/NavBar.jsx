import { Home, Star, Search, User, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/navBar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="nav-links">
          <NavItem
            icon={<Home size={18} />}
            text="Inicio"
            path="/inicio"
            activePath={location.pathname}
            onClick={() => navigate("/inicio")}
          />
          <NavItem
            icon={<Star size={18} />}
            text="Mis Metas"
            path="/mis-metas"
            activePath={location.pathname}
            onClick={() => navigate("/mis-metas")}
          />
          <NavItem
            icon={<Search size={18} />}
            text="Buscador de Metas"
            path="/buscador-metas"
            activePath={location.pathname}
            onClick={() => navigate("/buscador-metas")}
          />
          <NavItem
            icon={<User size={18} />}
            text="Mi Cuenta"
            path="/mi-cuenta"
            activePath={location.pathname}
            onClick={() => navigate("/mi-cuenta")}
          />
        </div>

        <button className="logout-button" onClick={() => navigate("/")}>
          <LogOut size={18} className="icon" />
          Salir
        </button>
      </div>
    </nav>
  );
}

function NavItem({ icon, text, path, activePath, onClick }) {
  return (
    <button
      className={`nav-item ${activePath === path ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span className="nav-text">{text}</span>
    </button>
  );
}
