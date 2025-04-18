import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../styles/crearMeta.css";
import useAuth from "../hooks/userAuth";

const API_URL = "http://localhost:4000/api/";

function EditarMeta() {
  useAuth();

  const navigate = useNavigate();
  const { id } = useParams();
  const nextId = useRef(1000);
  const isDragging = useRef(false);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await fetch(
          `${API_URL}goal/user/goals-with-objectives`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Error al obtener la meta");

        const data = await response.json();
        const meta = data.find((meta) => meta.id.toString() === id);

        if (!meta) throw new Error("Meta no encontrada");

        setTitulo(meta.title || "");
        setDescripcion(meta.description || "");

        const objetivosConOrden = (meta.objectives || []).map((obj) => ({
          id: String(obj.id),
          title: obj.title || "",
          description: obj.description || "",
          order: obj.goalListOrder || 1,
        }));

        setObjetivos(limpiarObjetivos(objetivosConOrden));
      } catch (error) {
        console.error("Error cargando la meta:", error);
      }
    };

    fetchMeta();
  }, [id]);

  const limpiarObjetivos = (lista) => {
    const llenos = lista.filter(
      (obj) => obj.title.trim() || obj.description.trim()
    );

    const vacíos = lista.filter(
      (obj) => !obj.title.trim() && !obj.description.trim()
    );

    const unoVacio =
      vacíos.length > 0
        ? [
            {
              ...vacíos[0],
              id: String(nextId.current++),
              title: "",
              description: "",
              order: llenos.length + 1,
            },
          ]
        : [];

    const nuevos = [...llenos, ...unoVacio];

    return nuevos.map((obj, index) => ({
      ...obj,
      order: index + 1,
    }));
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
    if (!result.destination) return;
    isDragging.current = false;
    const reordered = reorder(
      objetivos,
      result.source.index,
      result.destination.index
    );
    setObjetivos(limpiarObjetivos(reordered));
    setCambiosPendientes(true);
  };

  const handleTituloChange = (e) => {
    setTitulo(e.target.value);
    setCambiosPendientes(true);
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
    setCambiosPendientes(true);
  };

  const handleObjetivoChange = (index, field, value) => {
    const nuevos = [...objetivos];
    nuevos[index][field] = value;
    setObjetivos(limpiarObjetivos(nuevos));
    setCambiosPendientes(true);
  };

  const handleAgregarObjetivo = () => {
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

  const handleGuardarMeta = async () => {
    if (!titulo.trim()) {
      alert("El título es obligatorio");
      return;
    }

    const objetivosFiltrados = objetivos
      .filter((obj) => obj.title.trim() || obj.description.trim())
      .map((obj, index) => ({
        id: /^\d+$/.test(obj.id) ? Number(obj.id) : undefined,
        title: obj.title.trim(),
        description: obj.description.trim() || null,
        order: index + 1,
      }));

    if (objetivosFiltrados.length === 0) {
      objetivosFiltrados.push({
        title: titulo.trim(),
        description: descripcion.trim() || null,
        order: 1,
      });
    }

    const metaData = {
      title: titulo.trim(),
      description: descripcion.trim() || null,
      objectives: objetivosFiltrados,
    };

    try {
      const response = await fetch(`${API_URL}goal/${id}/update`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metaData),
      });

      if (!response.ok) throw new Error("Error al actualizar la meta");

      setCambiosPendientes(false);
      navigate("/mis-metas");
    } catch (error) {
      console.error("Error al actualizar la meta:", error);
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

  return (
    <div className="crear-meta-container">
      <h2>Editar Meta</h2>
      <label>Título</label>
      <input type="text" value={titulo} onChange={handleTituloChange} />

      <label>Descripción (opcional)</label>
      <textarea value={descripcion} onChange={handleDescripcionChange} />

      <h3>Objetivos</h3>
      <p>
        Si no añades objetivos, se creará uno con el mismo título y descripción
        de la meta.
      </p>

      {typeof window !== "undefined" && (
        <DragDropContext
          onDragStart={() => (isDragging.current = true)}
          onDragEnd={onDragEnd}
        >
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
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

export default EditarMeta;
