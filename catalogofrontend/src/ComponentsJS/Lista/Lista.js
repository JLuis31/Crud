import "../Lista/Lista.css";
import Form from "../Form/Form.js";
import Footer from "../Footer/Footer.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Lista = () => {
  const Navigte = useNavigate();
  const [productos, setProductos] = useState([]);
  const [oldstate, setoldstate] = useState(false);
  const token = localStorage.getItem("token");
  console.log(token);

  let data2 = oldstate;

  const Appear = function () {
    setoldstate(!oldstate);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get("https://localhost:7211/api/productos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      alert("Inicie Sesion.");
      return Navigte("/Login");
    }
    try {
      const response = await axios.delete(
        `https://localhost:7211/api/productos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  return (
    <div>
      <div className="contList">
        <Form data={data2}></Form>
        <div className="contAdd">
          {" "}
          <p>CRUD</p>{" "}
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
              {productos.map((productos) => (
                <tr key={productos.id}>
                  <td className="columns id">{productos.id}</td>
                  <td className="prodcutos">{productos.nombre}</td>
                  <td>$ {productos.precio.toFixed(2)}</td>
                  <td>{productos.descripcion}</td>
                  <td className="fecha">
                    {new Date(productos.fecha).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(productos.id)}
                      className="acciones"
                    >
                      Eliminar
                    </button>
                  </td>
                  <td>
                    <Link to={`/Actualizar/${productos.id}`}>
                      {" "}
                      <button className="acciones">Actualizar</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Lista;
