import React from "react";
import NavBar from "./NavBar";
import ListaMetas from "./ListaMetas";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function MisMetas() {
  return (
    <>
      <NavBar />
      <div className="page-content">
        <ListaMetas />
      </div>
    </>
  );
}

export default MisMetas;
