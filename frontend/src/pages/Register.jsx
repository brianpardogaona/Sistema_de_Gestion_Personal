import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import "../styles/miCuenta.css";

const API_URL = "http://localhost:4000/api/";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(API_URL + "user/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registro exitoso. Redirigiendo...");
        navigate("/inicio");
      } else {
        alert(result.error || "Error en el registro");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <div className="account-container">
      <h1 className="title">REGISTRARSE</h1>
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
              <Input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>APELLIDOS</label>
              <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <label>NOMBRE DE USUARIO</label>
          <Input type="text" name="username" value={formData.username} onChange={handleChange} />

          <label>CONTRASEÑA</label>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />

          <label>CONFIRMAR CONTRASEÑA</label>
          <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </div>

        <div className="buttons-container">
          <Button className="edit-button" onClick={handleRegister}>Registrarse</Button>
        </div>

        <p className="text-link" onClick={() => navigate("/")}>
          ¿Ya tienes cuenta? Inicia sesión aquí.
        </p>
      </div>
    </div>
  );
}

export default Register;
