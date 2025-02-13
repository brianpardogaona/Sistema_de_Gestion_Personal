import React from "react";
import { Menubar } from "primereact/menubar";
import "../../styles/navBar.css";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      command: () => navigate("/inicio"),
      className: location.pathname === "/inicio" ? "selected-item" : "",
    },
    {
      label: "Mis metas",
      icon: "pi pi-star",
      command: () => navigate("/mis-metas"),
      className: location.pathname === "/mis-metas" ? "selected-item" : "",
    },
    {
      label: "Buscador de metas",
      icon: "pi pi-search",
      items: [
        { label: "Meta 1", command: () => navigate("/meta1") },
        { label: "Meta 2", command: () => navigate("/meta2") },
      ],
    },
    {
      label: "Mi Cuenta",
      icon: "pi pi-user",
      command: () => navigate("/mi-cuenta"),
      className: location.pathname === "/mi-cuenta" ? "selected-item" : "",
    },
  ];

  const cerrarSesion = () => {
    navigate('/');
  };

  return (
    <div className="navbar-container">
      <div className="navbar-content">
        <Menubar model={items} />
        <button className="logout-button" onClick={cerrarSesion}>
          <i className="pi pi-sign-out" style={{ marginRight: "5px" }}></i> Salir
        </button>
      </div>
    </div>
  );
}

export default NavBar;
