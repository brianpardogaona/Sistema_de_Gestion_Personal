import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/login.css";
import "../styles/styles.css";

// Functions
import login from "@/pagesFunctions/login";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(true);
  const [errorAnimation, setErrorAnimation] = useState("");

  useEffect(() => {
    document.body.classList.add("dark");

    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      if (response.status === 200) {
        navigate("/inicio");
      } else {
        setPasswordIsCorrect(false);
        setErrorAnimation("shake");
        setTimeout(() => setErrorAnimation(""), 300);
      }
    } catch (e) {
      console.log(e);
    }
  };
  

  const isLoginButtonVisible =
    !passwordIsCorrect || (username !== "" && password !== "");

  return (
    <div
      className="login-container montserrat-400"
      onKeyDown={(e) => {
        if (e.key === "Enter" && isLoginButtonVisible) {
          handleLogin();
        }
      }}
      tabIndex="0"
    >
      <div id="left-side">
        <h2>¿Aún no tienes una cuenta?</h2>
        <Button id="register-button">Regístrate</Button>
      </div>
      <div id="right-side">
        <div id="title">
          <h1 className="bold">
            BIENVENIDO/A A TU GESTOR DE PROGRESO PERSONAL
          </h1>
        </div>
        <div id="panel">
          <h2>Nombre de usuario</h2>
          <Input
            value={username}
            type="text"
            placeholder="Nombre de usuario"
            onChange={(e) => setUsername(e.target.value)}
          />

          <h2
            id="passText"
            className={!passwordIsCorrect || username !== "" ? "show" : "stash"}
          >
            Contraseña
          </h2>
          <Input
            className={!passwordIsCorrect || username !== "" ? "show" : "stash"}
            value={password}
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />

          <p
            className={`warning ${
              !passwordIsCorrect ? `show ${errorAnimation}` : "stash"
            }`}
          >
            Las credenciales son incorrectas
          </p>

          <Button
            id="login-button"
            onClick={handleLogin}
            className={
              !passwordIsCorrect || (username !== "" && password !== "")
                ? "show"
                : "stash"
            }
          >
            Iniciar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
