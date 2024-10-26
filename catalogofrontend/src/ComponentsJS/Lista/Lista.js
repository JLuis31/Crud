import "../Lista/Lista.css";
import Form from "../Form/Form.js";
import Footer from "../Footer/Footer.js";
import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../Interceptor/authService.js";
import CirrcularProgress from "@mui/material/CircularProgress";

const Lista = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [oldstate, setOldState] = useState(false);
  const [loading, setloading] = useState("false");
  const token = localStorage.getItem("token");

  const Appear = () => {
    setOldState(!oldstate);
  };

  useEffect(() => {
    fetchProductos();
  }, []);
  const fetchProductos = async () => {
    try {
      const response = await axiosInstance.get("productos");
      setProductos(response.data);
    } catch (error) {
      alert("Error al obtener los productos.");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } finally {
      setloading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!localStorage.getItem("token")) {
      alert("Inicie sesión.");
      return navigate("/Login");
    }

    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este producto?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`productos/${id}`);

      alert("Producto eliminado correctamente.");
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar el producto", error);
      alert("Error al eliminar el producto. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div>
      <div className="contList">
        <Form data={oldstate} />
        <div className="contAdd">
          <p>CRUD</p>
          <button onClick={Appear} className="formularioAppear">
            Agregar / Cancelar
          </button>
        </div>

        <div className="tblcontainer">
          <table className={oldstate ? "blur" : ""} border="2px">
            <caption>Tabla de Registros</caption>

            <thead>
              <tr>
                <th className="id">ID</th>
                <th className="prodcutos">Nombre</th>
                <th>Precio</th>
                <th>Descripcion</th>
                <th className="fecha">Fecha</th>
                <th>Eliminar</th>
                <th>Actualizar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="loading">
                    <CirrcularProgress />{" "}
                    {/* Aquí estaba mal escrito el nombre del componente */}
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-products">
                    No hay productos disponibles.
                  </td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="columns id">{producto.id}</td>
                    <td className="prodcutos">{producto.nombre}</td>
                    <td>$ {producto.precio.toFixed(2)}</td>
                    <td>{producto.descripcion}</td>
                    <td className="fecha">
                      {new Date(producto.fecha).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="acciones"
                      >
                        Eliminar
                      </button>
                    </td>
                    <td>
                      <Link to={`/Actualizar/${producto.id}`}>
                        <button className="acciones">Actualizar</button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Lista;
