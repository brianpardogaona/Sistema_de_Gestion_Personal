import React from "react";
import { Menubar } from "primereact/menubar";

function NavBar() {
  const items = [
    { label: "Inicio", icon: "pi pi-home" },
    { label: "Mis metas", icon: "pi pi-star" },
    {
      label: "Buscador de metas",
      icon: "pi pi-search",
      items: [{ label: "Meta 1" }, { label: "Meta 2" }],
    },
    { label: "Ajustes", icon: "pi pi-cog" },
  ];
  return (
    <>
          <Menubar model={items} />
    </>
  );
}

export default NavBar;
