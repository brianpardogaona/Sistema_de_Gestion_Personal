import React from "react";
import NavBar from "../components/navBar/NavBar";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Components
import Grafica from "./Inicio_Components/Grafica";

function Inicio() {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "60px" }}>
        <Grafica />
      </div>
    </>
  );
}

export default Inicio;
