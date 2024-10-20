import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./ComponentsJS/Login-Register/Login/Login.js";

import Register from "./ComponentsJS/Login-Register/Register/Register.js";
import Menu from "../src/ComponentsJS/Menu/Menu.js";
import Lista from "./ComponentsJS/Lista/Lista.js";
import Actualizar from "../src/ComponentsJS/Actualizar/Actualizar.js";
import { StrictMode } from "react";

function App() {
  return (
    <StrictMode>
      <Router>
        <Menu></Menu>
        <Routes>
          <Route path="/" element={<Lista></Lista>}></Route>
          <Route path="/Login" element={<Login></Login>}></Route>
          <Route path="/Register" element={<Register />}></Route>
          <Route
            path="/Actualizar/:id"
            element={<Actualizar></Actualizar>}
          ></Route>
        </Routes>
      </Router>
    </StrictMode>
  );
}

export default App;
