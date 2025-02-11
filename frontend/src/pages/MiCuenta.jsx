import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/miCuenta.css";
import NavBar from "@/components/navBar/NavBar";

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
          <img src="/default-user.png" alt="Usuario" className="user-image" />
          <div className="inputs-container">
            <label>Nombre</label>
            <Input type="text" defaultValue="Brian" disabled={!editMode} />

            <label>Apellidos</label>
            <Input type="text" defaultValue="López" disabled={!editMode} />

            <label>Nombre de usuario</label>
            <Input type="text" defaultValue="brian123" disabled={!editMode} />

            {editMode && (
              <>
                <label>Contraseña</label>
                <Input type="password" placeholder="Nueva contraseña" />

                <label>Confirmar contraseña</label>
                <Input type="password" placeholder="Confirmar nueva contraseña" />
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
