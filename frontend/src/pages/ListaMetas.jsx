import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/lista.css";
import { Star, Edit2 } from "react-feather";

const API_URL = "http://localhost:4000/api/";

const estadosObjetivo = {
  pending: "Pendiente",
  inprogress: "En progreso",
  completed: "Completado",
};

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

function ListaMetas() {
  const [metas, setMetas] = useState([]);
  const [desplegadas, setDesplegadas] = useState({});
  const [filtro, setFiltro] = useState("title");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const fetchMetas = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/goal/user/sorted-goals?sortBy=${filtro}&order=${
          ordenAscendente ? "ASC" : "DESC"
        }`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener las metas: ${errorText}`);
      }

      const data = await response.json();
      setMetas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando las metas:", error);
      setMetas([]);
    }
  };

  useEffect(() => {
    fetchMetas();
  }, [filtro, ordenAscendente]);

  const toggleOrden = () => {
    setOrdenAscendente((prev) => !prev);
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setOrdenAscendente(true);
  };

  const handleBusquedaChange = (e) => setBusqueda(e.target.value.toLowerCase());

  const handleEstadoCambioAPI = async (objId, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}objective/${objId}/toggle`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: nuevoEstado }),
      });

      if (!response.ok) throw new Error("Error al actualizar el estado");

      const data = await response.json();

      setMetas((prevMetas) =>
        prevMetas.map((meta) => ({
          ...meta,
          goalObjectives: meta.goalObjectives.map((obj) =>
            obj.id === objId ? { ...obj, state: nuevoEstado } : obj
          ),
        }))
      );
      await fetchMetas();
    } catch (error) {
      console.error("Error al cambiar estado del objetivo:", error.message);
    }
  };

  const metasFiltradas = Array.isArray(metas)
    ? metas
        .filter(
          (meta) => meta.title && meta.title.toLowerCase().includes(busqueda)
        )
        .sort((a, b) => {
          if (filtro === "title") {
            return ordenAscendente
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          }
          return ordenAscendente
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        })
    : [];

  const metaCompletada = (meta) => {
    if (!meta.goalObjectives || meta.goalObjectives.length === 0) return false;
    return meta.goalObjectives.every((obj) => obj.state === "completed");
  };

  return (
    <div className="lista-metas">
      <div className="agenda-titulo">
        <Star size={24} />
        <h2>Mis Metas</h2>
      </div>
      <div className="header">
        <input
          type="text"
          placeholder="Buscar meta..."
          value={busqueda}
          onChange={handleBusquedaChange}
        />
        <div className="filtro">
          <select value={filtro} onChange={handleFiltroChange}>
            <option value="createdAt">Ordenar por Fecha</option>
            <option value="title">Ordenar por Nombre</option>
          </select>
          <button className="orden-btn" onClick={toggleOrden}>
            {ordenAscendente ? "▲" : "▼"}
          </button>
        </div>
        <button
          className="add-meta-btn"
          onClick={() => navigate("/crear-meta")}
        >
          Añadir Meta
        </button>
      </div>

      {metasFiltradas.length > 0 ? (
        metasFiltradas.map((meta) => (
          <div key={meta.id} className="meta">
            <div className="meta-header">
              <span
                className="meta-nombre clickable"
                onClick={() => navigate(`/detalle-meta/${meta.id}`)}
              >
                {metaCompletada(meta) && <span className="check-verde">✔</span>}{" "}
                {meta.title}
              </span>

              <div className="meta-derecha">
                <span className="meta-fecha">
                  {formatearFecha(meta.createdAt)}
                </span>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/editar-meta/${meta.id}`)}
                >
                  <Edit2 size={18} />
                </button>
                {meta.goalObjectives?.length > 0 && (
                  <button
                    className="desplegar-btn"
                    onClick={() =>
                      setDesplegadas((prev) => ({
                        ...prev,
                        [meta.id]: !prev[meta.id],
                      }))
                    }
                  >
                    {desplegadas[meta.id] ? "▲" : "▼"}
                  </button>
                )}
              </div>
            </div>

            {desplegadas[meta.id] && (
              <ul className="objetivos">
                {meta.goalObjectives.map((obj) => (
                  <li key={obj.id} className="objetivo-item">
                    <span className={`estado-circulo ${obj.state}`}></span>
                    <span className="objetivo-titulo">{obj.title}</span>
                    <select
                      value={obj.state}
                      onChange={(e) =>
                        handleEstadoCambioAPI(obj.id, e.target.value)
                      }
                    >
                      {Object.entries(estadosObjetivo).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                    {obj.completedAt && (
                      <span className="fecha">
                        {formatearFecha(obj.completedAt)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p className="no-metas">No hay metas disponibles.</p>
      )}
    </div>
  );
}

export default ListaMetas;
