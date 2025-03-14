import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/lista.css";
import { Star } from "react-feather";

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
  const [filtro, setFiltro] = useState("fecha");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const response = await fetch(
          API_URL + "goal/user/059b23f5-059b-4685-833c-5dd9c37f045e"
        );
        if (!response.ok) throw new Error("Error al obtener las metas");
        const data = await response.json();

        console.log("Datos obtenidos:", data);

        if (Array.isArray(data)) {
          setMetas(data);
        } else {
          console.error("La API no devuelve un array:", data);
          setMetas([]);
        }
      } catch (error) {
        console.error("Error cargando las metas:", error);
        setMetas([]);
      }
    };

    fetchMetas();
  }, []);

  const toggleOrden = () => setOrdenAscendente(!ordenAscendente);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setOrdenAscendente(true);
  };

  const handleBusquedaChange = (e) => setBusqueda(e.target.value.toLowerCase());

  const handleEstadoCambioAPI = async (metaId, objId, nuevoEstado) => {
    console.log("Intentando actualizar estado:", { objId, nuevoEstado });

    try {
      const response = await fetch(`${API_URL}objective/${objId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: nuevoEstado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el estado");
      }

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      setMetas((prevMetas) =>
        prevMetas.map((meta) => {
          const nuevosObjetivos = meta.goalObjectives.map((obj) =>
            obj.id === objId ? { ...obj, state: nuevoEstado } : obj
          );

          const todosCompletos = nuevosObjetivos.every(
            (obj) => obj.state === "completed"
          );

          return meta.id === metaId
            ? {
                ...meta,
                goalObjectives: nuevosObjetivos,
                state: todosCompletos ? "completed" : meta.state,
              }
            : meta;
        })
      );
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
          if (filtro === "nombre") {
            return ordenAscendente
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          }
          return ordenAscendente
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        })
    : [];

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
            <option value="fecha">Ordenar por Fecha</option>
            <option value="nombre">Ordenar por Nombre</option>
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
              <span className="meta-nombre">{meta.title}</span>
              <span className="meta-fecha">
                {formatearFecha(meta.createdAt)}
              </span>
              {meta.state === "completed" && (
                <span className="meta-completada">✔️</span>
              )}
              <button
                className="info-btn"
                onClick={() => navigate(`/info-meta/${meta.id}`)}
              >
                ℹ️
              </button>
              {meta.goalObjectives.length > 0 && (
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

            {desplegadas[meta.id] && (
              <ul className="objetivos">
                {meta.goalObjectives
                  .slice()
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((obj) => (
                    <li key={obj.id}>
                      {obj.title}{" "}
                      <span className="fecha">
                        {formatearFecha(obj.createdAt)}
                      </span>
                      <select
                        value={obj.state}
                        onChange={(e) =>
                          handleEstadoCambioAPI(meta.id, obj.id, e.target.value)
                        }
                      >
                        {Object.entries(estadosObjetivo).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
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
