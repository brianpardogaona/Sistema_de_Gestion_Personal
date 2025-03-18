import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/miCuenta.css";
import NavBar from "./NavBar";

const API_URL = "http://localhost:4000/api/";

function MiCuenta() {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({ name: "", lastName: "", username: "" });
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(API_URL + "user/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener el perfil");

        const data = await response.json();
        setUser(data);
        setFormData({ ...data, password: "", confirmPassword: "" });
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    if (editMode) {
      handleSave();
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(API_URL + `user/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password || undefined,
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar el perfil");

      const result = await response.json();
      alert(result.message);
      setUser({ ...formData, password: "", confirmPassword: "" });
      setEditMode(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    console.log("Eliminar cuenta");
  };

  return (
    <>
      <NavBar />
      <div className="account-container">
        <h1 className="title">MI CUENTA</h1>
        <div className={`account-box ${editMode ? "editar-activo" : ""}`}>
          <img
            src="../../public/images/perfil.png"
            alt="Usuario"
            className="user-image"
          />
          <div className="inputs-container">
            <div className="nombre-apellidos">
              <div className="input-group">
                <label>NOMBRE</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
              <div className="input-group">
                <label>APELLIDOS</label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>
            <br />
            <label>NOMBRE DE USUARIO</label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!editMode}
            />

            {editMode && (
              <>
                <br />
                <label>CONTRASEÑA</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nueva contraseña"
                />

                <label>CONFIRMAR CONTRASEÑA</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmar nueva contraseña"
                />
              </>
            )}
          </div>

          <div className="buttons-container">
            <Button className="edit-button" onClick={handleEdit}>
              {editMode ? "Guardar cambios" : "Editar cuenta"}
            </Button>
            <Button className="delete-button" onClick={handleDelete}>
              Eliminar cuenta
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MiCuenta;
