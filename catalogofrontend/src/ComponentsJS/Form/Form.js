import React, { useState, useEffect } from "react";
import "../Form/Form.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Interceptor/authService";

const ProductoForm = (props) => {
  const Navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [oldstate, setoldstate] = useState(props.data);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    setoldstate(props.data);
  }, [props.data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Inicie Sesión.");
      return Navigate("/Login");
    }

    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      descripcion,
      fecha,
    };

    try {
      const response = await axiosInstance.post("productos", nuevoProducto);

      alert("Producto agregado con éxito.");

      setNombre("");
      setPrecio("");
      setDescripcion("");
      setError("");
      window.location.reload();
    } catch (error) {
      console.error(
        "Error al agregar el producto",
        error.response ? error.response.data : error
      );
      setError(
        "Error al agregar el producto: " +
          (error.response ? error.response.data.message : "Error desconocido.")
      );
    }
  };

  return (
    <div className="cont">
      {oldstate === true && (
        <form onSubmit={handleSubmit}>
          <h2>Agregar Producto</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="inputs">
            <label>Nombre: </label>
            <input
              required
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input"
              placeholder="Nombre..."
            />
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
            />
          </div>
          <div className="inputs">
            <label>Descripción:</label>
            <input
              required
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="input"
              placeholder="Descripción..."
            />
          </div>
          <div className="inputs">
            <label>Fecha:</label>
            <input disabled type="date" value={fecha} className="input" />
          </div>
          <div className="contButton">
            <button type="submit">Confirmar</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductoForm;
