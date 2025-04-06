import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List } from "react-feather";
import Navbar from "./NavBar";
import "../styles/lista.css";

const API_URL = "http://localhost:4000/api/";

function formatearFecha(fechaStr) {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const fecha = new Date(fechaStr);
  return `${fecha.getDate()} de ${
    meses[fecha.getMonth()]
  } de ${fecha.getFullYear()}`;
}

function Agenda() {
  const [objetivos, setObjetivos] = useState([]);
  const [filtro, setFiltro] = useState("fecha");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const response = await fetch(
          API_URL + "objective/user/state/inprogress",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Error al obtener los objetivos");
        const data = await response.json();
        setObjetivos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando los objetivos:", error);
        setObjetivos([]);
      }
    };

    fetchObjetivos();
  }, []);

  const toggleOrden = () => setOrdenAscendente(!ordenAscendente);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setOrdenAscendente(true);
  };

  const objetivosFiltrados = objetivos.sort((a, b) => {
    if (filtro === "nombre") {
      return ordenAscendente
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return ordenAscendente
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="lista-metas">
          <div className="agenda-titulo">
            <List size={24} />
            <h2>Agenda</h2>
          </div>

          <div className="header">
            <div className="filtro">
              <select value={filtro} onChange={handleFiltroChange}>
                <option value="fecha">Ordenar por Fecha</option>
                <option value="nombre">Ordenar por Nombre</option>
              </select>
              <button className="orden-btn" onClick={toggleOrden}>
                {ordenAscendente ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {objetivosFiltrados.length > 0 ? (
            objetivosFiltrados.map((obj) => (
              <div key={obj.id} className="meta">
                <div className="meta-header">
                  <span className="meta-nombre">{obj.title}</span>
                  <span className="meta-fecha">
                    {formatearFecha(obj.createdAt)}
                  </span>
                  <button
                    className="info-btn"
                    onClick={() => navigate(`/info-meta/${obj.metaId}`)}
                  >
                    ℹ️
                  </button>
                </div>
                <div className="meta-asociada">
                  <span className="meta-titulo">{obj.metaTitulo}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-metas">No hay objetivos disponibles.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Agenda;
