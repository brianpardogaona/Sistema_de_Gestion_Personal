import { Home, Star, Search, User, LogOut, List } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/navBar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }

    navigate("/", { replace: true });
  };

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
            icon={<List size={18} />}
            text="Agenda"
            path="/agenda"
            activePath={location.pathname}
            onClick={() => navigate("/agenda")}
          />
          <NavItem
            icon={<Star size={18} />}
            text="Mis Metas"
            path="/mis-metas"
            activePath={location.pathname}
            onClick={() => navigate("/mis-metas")}
          />

          <NavItem
            icon={<User size={18} />}
            text="Mi Cuenta"
            path="/mi-cuenta"
            activePath={location.pathname}
            onClick={() => navigate("/mi-cuenta")}
          />
        </div>

        <button className="logout-button" onClick={handleLogout}>
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
