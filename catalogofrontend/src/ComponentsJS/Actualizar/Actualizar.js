import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Actualizar = function () {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const token = localStorage.getItem("token");
  console.log(token);

  useEffect(() => {
    const editProducto = async () => {
      try {
        const response = await fetch(
          `https://localhost:7211/api/productos/${id}`,
          {
            method: "GET", // Asegúrate de usar el método GET
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Agrega el token aquí
            },
          }
        );
        const data = await response.json();

        if (data) {
          setNombre(data.nombre);
          setPrecio(data.precio);
          setDescripcion(data.descripcion);
          setFecha(new Date().toISOString().split("T")[0]);
        } else {
          console.error("No se recibio un objeto valido.");
        }
      } catch (error) {
        console.error("Error al obtener el producto: ", error);
        alert("Ocurrio un error al cargar el producto.");
      }
    };
    editProducto();
  }, [id, token]);

  const handleSubmit = async (e) => {
    if (!token) {
      alert("Inicie Sesion.");
      return Navigate("/Login");
    }
    e.preventDefault();

    const response = await fetch(`https://localhost:7211/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agregar token aquí
      },
      body: JSON.stringify({
        nombre: nombre,
        precio: precio,
        descripcion: descripcion,
        fecha: fecha,
      }),
    });

    if (response.ok) {
      alert("Prodcuto actualizado correctamente.");
      Navigate("/");
    } else {
      alert("Error al actualizar el registro.");
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
    </div>
  );
};

export default Actualizar;
