import { Link } from "react-router-dom";
import React, { useState } from "react";
import Footer from "../../Footer/Footer.js";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import axios from "axios";

const Login = function () {
  const Navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:7211/api/auth/login",
        {
          Nombre: usuario,
          Contraseña: contraseña,
        }
      );

      const token = response.data.token;
      if (response.status === 200 && response.data) {
        localStorage.setItem("token", token);
        const { nombre } = response.data;
        localStorage.setItem("usuario", JSON.stringify(nombre));

        alert("Login exitoso.");
        Navigate("/");
      } else {
        console.log("Incorrecto");
      }
    } catch (error) {
      alert("Usuario o Contraseña incorrectos.");
      console.log("Error al iniciar sesión: ", error);
    }
  };
  return (
    <div>
      <div className="contform">
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <div className="form-content">
              <p className="form-title">Iniciar Sesion</p>
              <div className="contsincuenta">
                <p className="first">No tienes cuenta?</p>
                <Link to="/Register" className="linklogin">
                  <p> Crea una aqui</p>
                </Link>
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de usuario</label>
                <input
                  required
                  placeholder="Nombre:"
                  className="form-input"
                  id="username"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  required
                  className="form-input"
                  placeholder="Contraseña:"
                  id="password"
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                />
              </div>
              <button type="submit" className="form-button">
                Iniciar Sesion
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Login;
