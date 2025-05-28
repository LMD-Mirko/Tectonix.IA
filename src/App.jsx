import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./componentes/Nav.jsx";
import Inicio from "./inicio/inicio"; 
import Estadistica from "./Mostrar_Estadisticas/estadistica"; 
import Predictiva from "./consulta_predictiva/predictiva";
import ChatBot from "./Chatbot/Chatbot.jsx";
import Mapa from "./mapa/mapa.jsx";
import Error404 from "./Error404/Error.jsx";

function AppWrapper() {
  const location = useLocation();

  const rutasConNav = ["/", "/mapa", "/consulta", "/chatbot"];

  const ocultarNav = !rutasConNav.includes(location.pathname);

  return (
    <>
      {!ocultarNav && <Nav />}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/mapa" element={<Estadistica />} />
        <Route path="/consulta" element={<Predictiva />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/mapac" element={<Mapa />} />
        <Route path="*" element={<Error404 />} />
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
