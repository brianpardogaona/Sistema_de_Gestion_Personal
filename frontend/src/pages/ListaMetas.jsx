import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/lista.css";

const metasData = [
  {
    id: 1,
    nombre: "Mejorar Ventas",
    fechaCreacion: "2024-01-15",
    fecha: "2024-02-01",
    objetivos: [
      { id: 1, nombre: "Aumentar clientes en un 20%", fechaCreacion: "2024-01-16", fecha: "2024-02-02", estado: "" },
      { id: 2, nombre: "Incrementar la publicidad", fechaCreacion: "2024-01-17", fecha: "2024-02-03", estado: "" },
    ],
  },
  {
    id: 2,
    nombre: "Optimizar Gastos",
    fechaCreacion: "2024-01-10",
    fecha: "2024-01-20",
    objetivos: [
      { id: 3, nombre: "Reducir costos operativos", fechaCreacion: "2024-01-11", fecha: "2024-01-21", estado: "" },
      { id: 4, nombre: "Negociar con proveedores", fechaCreacion: "2024-01-12", fecha: "2024-01-22", estado: "" },
    ],
  },
  {
    id: 3,
    nombre: "Lanzar Nuevo Producto",
    fechaCreacion: "2024-02-01",
    fecha: "2024-03-05",
    objetivos: [],
  },
];

const estadosObjetivo = ["", "En progreso", "Completado"];

function formatearFecha(fechaStr) {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const fecha = new Date(fechaStr);
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

function ListaMetas() {
  const [metas, setMetas] = useState(metasData);
  const [desplegadas, setDesplegadas] = useState({});
  const [filtro, setFiltro] = useState("fecha");
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const toggleOrden = () => {
    setOrdenAscendente(!ordenAscendente);
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setOrdenAscendente(true);
  };

  const handleBusquedaChange = (e) => setBusqueda(e.target.value.toLowerCase());

  const handleEstadoCambio = (metaId, objId, nuevoEstado) => {
    setMetas((prevMetas) =>
      prevMetas.map((meta) => {
        const nuevosObjetivos = meta.objetivos.map((obj) =>
          obj.id === objId ? { ...obj, estado: nuevoEstado } : obj
        );
        const todosCompletos = nuevosObjetivos.length > 0 && nuevosObjetivos.every((obj) => obj.estado === "Completado");
        return meta.id === metaId ? { ...meta, objetivos: nuevosObjetivos, estado: todosCompletos ? "Completada" : "" } : meta;
      })
    );
  };

  const metasFiltradas = metas
    .filter((meta) => meta.nombre.toLowerCase().includes(busqueda))
    .sort((a, b) => {
      if (filtro === "nombre") {
        return ordenAscendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre);
      }
      return ordenAscendente ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
    });

  return (
    <div className="lista-metas">
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
        <button className="add-meta-btn" onClick={() => navigate("/crear-meta")}>
          Añadir Meta
        </button>
      </div>

      {metasFiltradas.map((meta) => (
        <div key={meta.id} className="meta">
          <div className="meta-header">
            <span className="meta-nombre">{meta.nombre}</span>
            <span className="meta-fecha">{formatearFecha(meta.fechaCreacion)}</span>
            {meta.estado === "Completada" && <span className="meta-completada">✔️</span>}
            <button
              className="info-btn"
              onClick={() => navigate(`/info-meta/${meta.id}`)}
            >
              ℹ️
            </button>
            {meta.objetivos.length > 0 && (
              <button
                className="desplegar-btn"
                onClick={() =>
                  setDesplegadas((prev) => ({ ...prev, [meta.id]: !prev[meta.id] }))
                }
              >
                {desplegadas[meta.id] ? "▲" : "▼"}
              </button>
            )}
          </div>

          {desplegadas[meta.id] && (
            <ul className="objetivos">
              {meta.objetivos.map((obj) => (
                <li key={obj.id}>
                  {obj.nombre} <span className="fecha">{formatearFecha(obj.fechaCreacion)}</span>
                  <select
                    value={obj.estado}
                    onChange={(e) => handleEstadoCambio(meta.id, obj.id, e.target.value)}
                  >
                    {estadosObjetivo.map((estado, index) => (
                      <option key={index} value={estado}>{estado || "Sin estado"}</option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default ListaMetas;
