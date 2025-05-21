// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./componentes/Nav.jsx";
import Inicio from "./inicio/inicio"; 
import Estadistica from "./Mostrar_Estadisticas/estadistica"; 

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/mapa" element={<Estadistica />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;
