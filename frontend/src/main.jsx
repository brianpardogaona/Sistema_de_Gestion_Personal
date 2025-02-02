import { createRoot } from "react-dom/client";
// import Inicio from './Inicio.jsx'
import "./styles/inicio.css";
import Login from "./pages/Login.jsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import App from "./routes";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);
