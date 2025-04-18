import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/detalleMeta.css";

const estadosObjetivo = {
  pending: "Pendiente",
  inprogress: "En progreso",
  completed: "Completado",
};

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

export default function DetalleMeta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(`${API_URL}goal/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setMeta(data);
      } catch (err) {
        console.error("Error al cargar la meta", err);
      }
    };
    fetchMeta();
  }, [id]);

  if (!meta) {
    return <div className="detalle-meta">Cargando meta...</div>;
  }

  return (
    <div className="detalle-meta">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="meta-info">
        <h2>{meta.title}</h2>
        <p className="descripcion">{meta.description}</p>
        <p className="fecha">Creada el: {formatearFecha(meta.createdAt)}</p>
        <p className={`estado ${meta.state}`}>
          Estado: {meta.state === "completed" ? "Completada" : "Pendiente"}
        </p>
      </div>

      <h3 className="titulo-objetivos">Objetivos</h3>
      <ul className="lista-objetivos">
        {meta.goalObjectives
          ?.sort((a, b) => a.goalListOrder - b.goalListOrder)
          .map((obj) => (
            <li key={obj.id} className="objetivo-detalle">
              <div className="orden">#{obj.goalListOrder}</div>
              <div className="contenido">
                <h4>{obj.title}</h4>
                <p>{obj.description}</p>
                <p>Creado el: {formatearFecha(obj.createdAt)}</p>
                <p className={`estado ${obj.state}`}>
                  Estado: {estadosObjetivo[obj.state]}
                </p>
                {obj.completedAt && (
                  <p className="completado">
                    Finalizado el: {formatearFecha(obj.completedAt)}
                  </p>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
