import "../Register/Register.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = function () {
  const Navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoRegistro = { nombre, contraseña };

    if (contraseña === confirmarContraseña) {
      try {
        const response = await axios.post(
          "https://localhost:7211/api/registros",
          nuevoRegistro
        );
        alert("Registro exitoso.");
        Navigate("/Login");
        setNombre("");
        setContraseña("");
        setConfirmarContraseña("");
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert("Usuario ya existente");
          window.location.reload();
        }
        console.log("Error al agregar los datos: ", error);
      }
    } else {
      alert("Las contraseñas no coinciden.");
    }
  };

  return (
    <div className="contform">
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-content">
            <p className="form-title">Crear cuenta</p>
            <Link to="/Login" className="linklogin">
              <p>Volver a inicio de sesion</p>
            </Link>
            <div className="form-group">
              <label className="form-label">Nombre de usuario</label>
              <input
                required
                placeholder="Nombre:"
                className="form-input"
                id="username"
                type="text"
                onChange={(e) => setNombre(e.target.value)}
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
                onChange={(e) => setContraseña(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input
                required
                className="form-input"
                placeholder="Contraseña:"
                id="confirmPassword"
                type="password"
                onChange={(e) => setConfirmarContraseña(e.target.value)}
              />
            </div>

            <button type="submit" className="form-button">
              Crear cuenta
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
