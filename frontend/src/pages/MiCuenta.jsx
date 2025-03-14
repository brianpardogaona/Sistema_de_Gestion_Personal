import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/miCuenta.css";
import NavBar from "./NavBar";

function MiCuenta() {
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(!editMode);
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
                <Input type="text" defaultValue="Nombre" disabled={!editMode} />
              </div>
              <div className="input-group">
                <label>APELLIDOS</label>
                <Input
                  type="text"
                  defaultValue="Apellido"
                  disabled={!editMode}
                />
              </div>
            </div>
            <br />
            <label>NOMBRE DE USUARIO</label>
            <Input type="text" defaultValue="user123" disabled={!editMode} />

            {editMode && (
              <>
                <br />
                <label>CONTRASEÑA</label>
                <Input type="password" placeholder="Nueva contraseña" />

                <label>CONFIRMAR CONTRASEÑA</label>
                <Input
                  type="password"
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
