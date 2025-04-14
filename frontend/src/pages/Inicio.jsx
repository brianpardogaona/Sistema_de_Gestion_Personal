import React from "react";
import NavBar from "./NavBar";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles/inicio.css"

// Components
import Grafica from "./Inicio_Components/Grafica";

function Inicio() {
  return (
    <>
      <NavBar />
      <div className="graph-content">
        <div className="chart-space">
          <Grafica />
        </div>
        
      </div>
    </>
  );
}

export default Inicio;
