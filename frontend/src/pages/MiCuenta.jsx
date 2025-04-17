import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/miCuenta.css";
import NavBar from "./NavBar";
import ModalCuenta from "./ModalCuenta";

const API_URL = "http://localhost:4000/api/";

function MiCuenta() {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({ name: "", lastName: "", username: "" });
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    username: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
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
        setFormData({ ...data });
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(API_URL + `user`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar el perfil");

      const result = await response.json();
      alert(result.message);
      setUser({ ...formData });
      setEditMode(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;

    const errors = {
      currentPassword: !currentPassword,
      newPassword: !newPassword,
      confirmNewPassword: !confirmNewPassword,
    };

    setPasswordErrors(errors);

    if (Object.values(errors).some((field) => field)) {
      alert("Por favor, rellena todos los campos.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordErrors({
        ...errors,
        confirmNewPassword: true,
      });
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      const response = await fetch(API_URL + "user/change-password", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert(data.message);
      closeModal();
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      alert("Ocurrió un error inesperado.");
    }
  };

  const handleDeleteAccount = async () => {
    alert(
      "Aquí se haría la petición para eliminar la cuenta con la contraseña actual."
    );
    closeModal();
  };

  return (
    <>
      <NavBar />
      <div className="account-container">
        <h1 className="title">MI CUENTA</h1>
        <div className="account-box">
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
          </div>

          <div className="buttons-container">
            {editMode ? (
              <>
                <Button className="edit-button" onClick={handleSave}>
                  Guardar cambios
                </Button>
                <Button
                  className="password-button"
                  onClick={() => openModal("editar")}
                >
                  Editar contraseña
                </Button>
                <Button
                  className="delete-button"
                  onClick={() => openModal("eliminar")}
                >
                  Eliminar cuenta
                </Button>
              </>
            ) : (
              <Button className="edit-button" onClick={handleEdit}>
                Editar cuenta
              </Button>
            )}
          </div>
        </div>
      </div>

      <ModalCuenta
        tipo={modalType}
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={
          modalType === "editar" ? handlePasswordUpdate : handleDeleteAccount
        }
        formData={passwordForm}
        handleChange={handlePasswordFormChange}
        errors={passwordErrors}
      />
    </>
  );
}

export default MiCuenta;
