import React, { useEffect, useState } from "react";
// import { Button } from "./components/ui/button";
// import "./login.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "../styles/login.css";
import "../styles/styles.css";

// functions
import login from "@/pagesFunctions/login";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Each time Login is loaded, "dark" theme is applied
  useEffect(() => {
    document.body.classList.add("dark");

    return () => {
      document.body.classList.remove("dark");
    };
  }, []);



  return (
    <>
      <div className="login-container montserrat-400">
        <div id="left-side">
          <h2>¿Aún no tienes una cuenta?</h2>
          <Button id="register-button">Regístrate</Button>
        </div>
        <div id="right-side">
          <div id="title">
            <h1>BIENVENDIDO/A A TU GESTOR DE PROGRESO PERSONAL</h1>
          </div>
          <div id="panel">
            <h2>Introduce tu nombre de usuario</h2>
            <Input value={username} type="text" placeholder="Nombre de usuario" onChange={(e) => {setUsername(e.target.value)}}/>
            {username != "" && (
              <>
                <h2 id="passText">Introduce tu contraseña</h2>
                <Input  value={password} type="password" placeholder="Contraseña" onChange={(e) => {setPassword(e.target.value)}}/>
                
              </>
            )}
            {
              username != "" && password !="" &&
              <>
                <Button id="login-button" onClick={async ()=>{await login(username, password)}}>Iniciar sesión</Button>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
