import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Form/Form.css";
import { useNavigate } from "react-router-dom";

const ProductoForm = (props) => {
  const Navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [oldstate, setoldstate] = useState(props.data);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setoldstate(props.data);
  }, [props.data]);

  const handleSubmit = async (e) => {
    if (!token) {
      alert("Inicie Sesion.");
      return Navigate("/Login");
    }

    e.preventDefault();

    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      descripcion,
      fecha,
    };

    try {
      const response = await axios.post(
        "https://localhost:7211/api/productos",
        nuevoProducto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Prodcuto agregado con exito.");
      window.location.reload();
      console.log("Producto agregado:", response.data);
      setNombre("");
      setPrecio("");
      setDescripcion("");
      setFecha(new Date().toISOString().split("T")[0]);
      setError("");
    } catch (error) {
      console.error("Error al agregar el producto", error);
      setError("Error al agregar el producto.");
    }
  };

  return (
    <div className="cont">
      {oldstate === true ? (
        <form onSubmit={handleSubmit}>
          <h2>Agregar Producto</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          <div className="inputs">
            <label>Nombre: </label>
            <input
              required
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              class="input"
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
              class="input"
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
              class="input"
              placeholder="Descripcion..."
            ></input>
          </div>
          <div className="inputs">
            <label>Fecha:</label>
            <input disabled type="date" value={fecha} class="input"></input>
          </div>
          <div className="contButton">
            <button type="submit">Confirmar</button>
          </div>
        </form>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductoForm;
