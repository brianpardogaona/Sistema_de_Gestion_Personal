import React, { useEffect, useState } from "react";
// import { Button } from "./components/ui/button";
// import "./login.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/login.css";
import "../styles/styles.css";

// functions
import login from "@/pagesFunctions/login";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(true);

  // Each time Login is loaded, "dark" theme is applied
  useEffect(() => {
    document.body.classList.add("dark");

    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  // handle fetch Login
  const handleLogin = async () => {
    const response = await login(username, password);

    try {
      if (response.status === 200) {
        navigate("/inicio");
      } else {
        setPasswordIsCorrect(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="login-container montserrat-400">
        <div id="left-side">
          <h2>¿Aún no tienes una cuenta?</h2>
          <Button id="register-button">Regístrate</Button>
        </div>
        <div id="right-side">
          <div id="title">
            <h1 className="bold">BIENVENDIDO/A A TU GESTOR DE PROGRESO PERSONAL</h1>
          </div>
          <div id="panel">
            <h2>Nombre de usuario</h2>
            <Input
              value={username}
              type="text"
              placeholder="Nombre de usuario"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />

            <h2
              id="passText"
              className={
                !passwordIsCorrect || username != "" ? "show" : "stash"
              }
            >
              Contraseña
            </h2>
            <Input
              className={
                !passwordIsCorrect || username != "" ? "show" : "stash"
              }
              value={password}
              type="password"
              placeholder="Contraseña"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <p className={!passwordIsCorrect ? "show bold warning" : "stash"}>
              La contraseña es incorrecta
            </p>

            <Button
              id="login-button"
              onClick={handleLogin}
              className={
                !passwordIsCorrect || (username != "" && password != "")
                  ? "show"
                  : "stash"
              }
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
