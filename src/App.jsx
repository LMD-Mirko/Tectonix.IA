import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Nav from "./componentes/Nav";
import Inicio from "./inicio/inicio";
import MapaView from "./Mostrar_Estadisticas/estadistica";
import MapaCView from "./mapa/mapa";
import PredictivaView from "./consulta_predictiva/predictiva";
import ChatbotView from "./Chatbot/Chatbot";
import Error404 from "./Error404/Error";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Nav />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/mapa" element={<MapaView />} />
            <Route path="/mapac" element={<MapaCView />} />
            <Route path="/consulta" element={<PredictivaView />} />
            <Route path="/chatbot" element={<ChatbotView />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
