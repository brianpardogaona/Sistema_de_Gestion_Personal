import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/lista.css";

const metasData = [
  {
    id: 1,
    nombre: "Mejorar Ventas",
    fecha: "2024-02-01",
    objetivos: [
      { id: 1, nombre: "Aumentar clientes en un 20%", fecha: "2024-02-02", completado: false },
      { id: 2, nombre: "Incrementar la publicidad", fecha: "2024-02-03", completado: false },
    ],
  },
  {
    id: 2,
    nombre: "Optimizar Gastos",
    fecha: "2024-01-20",
    objetivos: [
      { id: 3, nombre: "Reducir costos operativos", fecha: "2024-01-21", completado: false },
      { id: 4, nombre: "Negociar con proveedores", fecha: "2024-01-22", completado: false },
    ],
  },
  {
    id: 3,
    nombre: "Lanzar Nuevo Producto",
    fecha: "2024-03-05",
    objetivos: [],
  },
];

// 🔹 Función para formatear la fecha
const formatearFecha = (fechaStr) => {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const fecha = new Date(fechaStr);
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
};

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

  const handleMetaCheckbox = (metaId) => {
    setMetas((prevMetas) =>
      prevMetas.map((meta) =>
        meta.id === metaId
          ? {
              ...meta,
              objetivos: meta.objetivos.map((obj) => ({ ...obj, completado: !meta.objetivos.every((o) => o.completado) })),
            }
          : meta
      )
    );
  };

  const handleObjetivoCheckbox = (metaId, objId) => {
    setMetas((prevMetas) =>
      prevMetas.map((meta) =>
        meta.id === metaId
          ? {
              ...meta,
              objetivos: meta.objetivos.map((obj) =>
                obj.id === objId ? { ...obj, completado: !obj.completado } : obj
              ),
            }
          : meta
      )
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

      {metasFiltradas.map((meta) => {
        const todosCompletos = meta.objetivos.length > 0 && meta.objetivos.every((o) => o.completado);

        return (
          <div key={meta.id} className="meta">
            <div className="meta-header">
              <input type="checkbox" checked={todosCompletos} onChange={() => handleMetaCheckbox(meta.id)} />
              <span className="meta-nombre">
                {meta.nombre} <span className="fecha">({formatearFecha(meta.fecha)})</span>
              </span>
              {meta.objetivos.length > 0 && (
                <button className="desplegar-btn" onClick={() => setDesplegadas((prev) => ({ ...prev, [meta.id]: !prev[meta.id] }))}>
                  {desplegadas[meta.id] ? "▲" : "▼"}
                </button>
              )}
            </div>

            {desplegadas[meta.id] && meta.objetivos.length > 0 && (
              <ul className="objetivos">
                {meta.objetivos.map((obj) => (
                  <li key={obj.id}>
                    <input type="checkbox" checked={obj.completado} onChange={() => handleObjetivoCheckbox(meta.id, obj.id)} />
                    {obj.nombre} <span className="fecha">({formatearFecha(obj.fecha)})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ListaMetas;
