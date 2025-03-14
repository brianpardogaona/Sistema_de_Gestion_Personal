import { createRoot } from "react-dom/client";
import "./styles/inicio.css";
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
