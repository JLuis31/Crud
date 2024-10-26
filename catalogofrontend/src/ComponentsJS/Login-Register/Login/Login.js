import { Link } from "react-router-dom";
import React, { useState } from "react";
import Footer from "../../Footer/Footer.js";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import axiosInstance from "../../Interceptor/authService.js";
import CirrcularProgress from "@mui/material/CircularProgress";

const Login = function () {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(`auth/login`, {
        Nombre: usuario,
        Contraseña: contraseña,
      });

      console.log("Respuesta completa del servidor:", response.data);

      const token = response.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        const { nombre } = response.data;
        localStorage.setItem("usuario", JSON.stringify(nombre));
        alert("Login exitoso.");

        navigate("/");
      } else {
        console.log("Token no recibido.");
      }
    } catch (error) {
      if (error.response) {
        console.log("Error de respuesta del servidor:", error.response.data);
        alert("Error: " + error.response.data.message);
      } else {
        console.log("Error de conexión:", error.message);
        alert("Error de conexión. Inténtalo de nuevo.");
      }
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
      <Footer />
    </div>
  );
};

export default Login;
