import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/crearMeta.css";

const API_URL = "http://localhost:4000/api/";

function EditarMeta() {
  const navigate = useNavigate();
  const { id } = useParams();
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
        setObjetivos(
          meta.objectives?.map((obj, index) => ({
            id: obj.id,
            title: obj.title || "",
            description: obj.description || "",
            order: index + 1,
          })) || []
        );
      } catch (error) {
        console.error("Error cargando la meta:", error);
      }
    };

    fetchMeta();
  }, [id]);

  const handleTituloChange = (e) => {
    setTitulo(e.target.value);
    setCambiosPendientes(true);
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
    setCambiosPendientes(true);
  };

  const handleObjetivoChange = (index, field, value) => {
    const nuevosObjetivos = [...objetivos];
    nuevosObjetivos[index][field] = value;

    const objetivosNoVacios = nuevosObjetivos.filter(
      (obj) => obj.title.trim() !== "" || obj.description.trim() !== ""
    );

    if (objetivosNoVacios.length < nuevosObjetivos.length) {
      objetivosNoVacios.push({
        title: "",
        description: "",
        order: objetivosNoVacios.length + 1,
      });
    }

    setObjetivos(objetivosNoVacios);
    setCambiosPendientes(true);
  };

  const handleAgregarObjetivo = () => {
    const objetivosNoVacios = objetivos.filter(
      (obj) => obj.title.trim() !== "" || obj.description.trim() !== ""
    );

    setObjetivos([
      ...objetivosNoVacios,
      { title: "", description: "", order: objetivosNoVacios.length + 1 },
    ]);
    setCambiosPendientes(true);
  };

  const handleEliminarObjetivo = (index) => {
    const nuevosObjetivos = objetivos.filter((_, i) => i !== index);
    if (nuevosObjetivos.length === 0) {
      nuevosObjetivos.push({ title: "", description: "", order: 1 });
    }
    setObjetivos(nuevosObjetivos);
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
        id: obj.id,
        title: obj.title.trim(),
        description: obj.description.trim() || null,
        order: index + 1,
      }));

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
      {objetivos.map((obj, index) => (
        <div key={index} className="objetivo-item">
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
              handleObjetivoChange(index, "description", e.target.value)
            }
          />
          <button
            className="remove-objetivo-btn"
            onClick={() => handleEliminarObjetivo(index)}
          >
            <img src="../../public/images/boton-menos.png" alt="Eliminar" />
          </button>
        </div>
      ))}

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
