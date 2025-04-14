import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List } from "react-feather";
import Navbar from "./NavBar";
import "../styles/lista.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const API_URL = "http://localhost:4000/api/";

function formatearFecha(fechaStr) {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const fecha = new Date(fechaStr);
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

function Agenda() {
  const [objetivos, setObjetivos] = useState([]);
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

  const objetivosFiltrados = objetivos
    .filter((obj) => obj.agendaListOrder !== null)
    .sort((a, b) => a.agendaListOrder - b.agendaListOrder);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result.map((item, index) => ({
      ...item,
      agendaListOrder: index + 1,
    }));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const nuevos = reorder(
      objetivosFiltrados,
      result.source.index,
      result.destination.index
    );

    setObjetivos(nuevos);

    try {
      const response = await fetch(
        API_URL + "objective/user/update-agenda-order",
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: nuevos.map((obj) => obj.id),
          }),
        }
      );

      if (!response.ok) throw new Error("No se pudo actualizar el orden");
    } catch (err) {
      console.error("Error al actualizar orden:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="lista-metas">
          <div className="agenda-titulo">
            <List size={24} />
            <h2>Agenda</h2>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="agenda">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {objetivosFiltrados.map((obj, index) => (
                    <Draggable
                      key={obj.id.toString()}
                      draggableId={obj.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="meta"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}

export default Agenda;
