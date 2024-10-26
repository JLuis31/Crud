import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "../Interceptor/authService";

const Actualizar = function () {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const token = localStorage.getItem("token");

  const editProducto = async () => {
    try {
      const response = await axiosInstance.get(
        `https://localhost:7211/api/productos/${id}`
      );
      const data = response.data;

      if (data) {
        setNombre(data.nombre);
        setPrecio(data.precio);
        setDescripcion(data.descripcion);
        setFecha(new Date(data.fecha).toISOString().split("T")[0]);
      } else {
        console.error("No se recibió un objeto válido.");
      }
    } catch (error) {
      console.error("Error al obtener el producto: ", error);
    }
  };

  useEffect(() => {
    editProducto();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!nombre || !precio || !descripcion || !fecha) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!token) {
      alert("Inicie sesión.");
      return navigate("/Login");
    }

    try {
      const response = await axiosInstance.put(
        `https://localhost:7211/api/productos/${id}`,
        {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          fecha,
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert("Producto actualizado correctamente.");
        navigate("/");
      } else {
        alert("Error al actualizar el registro.");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Error en la solicitud. Por favor, intenta de nuevo.";
      alert(errorMessage);
    }
  };

  return (
    <div className="cont">
      <form onSubmit={handleSubmit}>
        <h2>Actualizar Producto</h2>
        <div className="inputs">
          <label>Nombre: </label>
          <input
            required
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
            placeholder="Nombre..."
          ></input>
        </div>
        <div className="inputs">
          <label>Precio: </label>
          <input
            required
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="input"
            placeholder="Precio..."
          ></input>
        </div>
        <div className="inputs">
          <label>Descripcion:</label>
          <input
            required
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input"
            placeholder="Descripcion..."
          ></input>
        </div>
        <div className="inputs">
          <label>Fecha:</label>
          <input disabled type="date" value={fecha} className="input"></input>
        </div>
        <div className="contButton">
          <button type="submit">Confirmar</button>
        </div>
      </form>
    </div>
  );
};

export default Actualizar;
