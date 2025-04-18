import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/modalCuenta.css";

function ModalCuenta({
  tipo,
  visible,
  onClose,
  onSubmit,
  formData,
  handleChange,
  errors = {},
}) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{tipo === "editar" ? "Cambiar Contraseña" : "Eliminar Cuenta"}</h2>

        <label>Contraseña actual</label>
        <Input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className={errors.currentPassword ? "input-error" : ""}
        />

        {tipo === "eliminar" && (
          <p className="warning-text">
            Esta acción es irreversible. Toda tu información se eliminará
            permanentemente.
          </p>
        )}

        {tipo === "editar" && (
          <>
            <label>Nueva contraseña</label>
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? "input-error" : ""}
            />

            <label>Confirmar nueva contraseña</label>
            <Input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className={errors.confirmNewPassword ? "input-error" : ""}
            />
          </>
        )}

        <div className="modal-buttons">
          <Button onClick={onSubmit}>
            {tipo === "editar"
              ? "Actualizar contraseña"
              : "Confirmar eliminación"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalCuenta;
