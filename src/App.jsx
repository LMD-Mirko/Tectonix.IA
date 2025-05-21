import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./componentes/Nav.jsx";
import Inicio from "./inicio/inicio"; 
import Estadistica from "./Mostrar_Estadisticas/estadistica"; 
import Predictiva from "./consulta_predictiva/predictiva";
import ChatBot from "./Chatbot/Chatbot.jsx";

function AppWrapper() {
  const location = useLocation();

  const ocultarNav = location.pathname === "/chatbot";

  return (
    <>
      {!ocultarNav && <Nav />}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/mapa" element={<Estadistica />} />
        <Route path="/consulta" element={<Predictiva />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
