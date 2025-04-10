import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/crearMeta.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const API_URL = "http://localhost:4000/api/";

function CrearMeta() {
  const navigate = useNavigate();
  const nextId = useRef(2);
  const isDragging = useRef(false);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [objetivos, setObjetivos] = useState([
    { id: "1", title: "", description: "", order: 1 },
  ]);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);

  const handleTituloChange = (e) => {
    setTitulo(e.target.value);
    setCambiosPendientes(true);
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
    setCambiosPendientes(true);
  };

  const handleAgregarObjetivo = () => {
    if (isDragging.current) return;

    const hayVacio = objetivos.some(
      (obj) => !obj.title.trim() && !obj.description.trim()
    );
    if (hayVacio) return;

    setObjetivos((prev) => [
      ...prev,
      {
        id: String(nextId.current++),
        title: "",
        description: "",
        order: prev.length + 1,
      },
    ]);
    setCambiosPendientes(true);
  };

  const handleEliminarObjetivo = (index) => {
    if (isDragging.current) return;

    const nuevos = objetivos.filter((_, i) => i !== index);
    setObjetivos(limpiarObjetivos(nuevos));
    setCambiosPendientes(true);
  };

  const handleObjetivoChange = (index, field, value) => {
    if (isDragging.current) return;

    const nuevos = [...objetivos];
    nuevos[index][field] = value;

    setObjetivos(limpiarObjetivos(nuevos));
    setCambiosPendientes(true);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
  };

  const onDragEnd = (result) => {
    let reordered = reorder(
      objetivos,
      result.source.index,
      result.destination.index
    );

    setObjetivos(limpiarObjetivos(reordered));
    setCambiosPendientes(true);
  };

  const handleGuardarMeta = async () => {
    if (!titulo.trim()) {
      alert("El título es obligatorio");
      return;
    }

    const objetivosFiltrados = objetivos
      .filter((obj) => obj.title.trim() || obj.description.trim())
      .map((obj, index) => ({
        title: obj.title.trim(),
        description: obj.description.trim() || null,
        order: index + 1,
      }));

    const metaData = {
      title: titulo.trim(),
      description: descripcion.trim() || null,
      objectives:
        objetivosFiltrados.length > 0
          ? objetivosFiltrados
          : [
              {
                title: titulo.trim(),
                description: descripcion.trim() || null,
                order: 1,
              },
            ],
    };

    try {
      const response = await fetch(`${API_URL}goal/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metaData),
      });

      if (!response.ok) throw new Error("Error al crear la meta");

      setCambiosPendientes(false);
      navigate("/mis-metas");
    } catch (error) {
      console.error("Error al guardar la meta:", error);
    }
  };

  const handleBack = () => {
    if (cambiosPendientes) {
      const confirmacion = window.confirm(
        "Tienes cambios sin guardar. ¿Seguro que quieres salir?"
      );
      if (!confirmacion) return;
    }
    navigate("/mis-metas");
  };

  const limpiarObjetivos = (lista) => {
    const llenos = lista.filter(
      (obj) => obj.title.trim() || obj.description.trim()
    );

    return [
      ...llenos,
      {
        id: String(nextId.current++),
        title: "",
        description: "",
        order: llenos.length + 1,
      },
    ];
  };

  return (
    <div className="crear-meta-container">
      <h2>Crear Nueva Meta</h2>
      <label>Título</label>
      <input type="text" value={titulo} onChange={handleTituloChange} />

      <label>Descripción (opcional)</label>
      <textarea value={descripcion} onChange={handleDescripcionChange} />

      <h3>Objetivos</h3>
      <p>
        Si no añades objetivos, se creará uno con el mismo título y descripción
        de la meta.
      </p>

      {typeof window !== "undefined" && objetivos.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="objetivos">
            {(provided) => (
              <div
                className="objetivos-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {objetivos.map((obj, index) => (
                  <Draggable
                    key={obj.id}
                    draggableId={obj.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="objetivo-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span className="drag-handle">≡</span>
                        <input
                          type="text"
                          placeholder="Título del objetivo"
                          value={obj.title}
                          onChange={(e) =>
                            handleObjetivoChange(index, "title", e.target.value)
                          }
                        />
                        <textarea
                          placeholder="Descripción del objetivo (opcional)"
                          value={obj.description}
                          onChange={(e) =>
                            handleObjetivoChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="remove-objetivo-btn"
                          onClick={() => handleEliminarObjetivo(index)}
                        >
                          <img
                            src="../../public/images/boton-menos.png"
                            alt="Eliminar"
                          />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <button className="add-objetivo-btn" onClick={handleAgregarObjetivo}>
        <img src="../../public/images/mas.png" alt="Agregar" />
      </button>

      <div className="btn-group">
        <button className="cancel-btn" onClick={handleBack}>
          Cancelar
        </button>
        <button className="save-btn" onClick={handleGuardarMeta}>
          Guardar
        </button>
      </div>
    </div>
  );
}

export default CrearMeta;
