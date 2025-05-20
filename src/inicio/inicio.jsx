import React from "react";
import "./inicio.modulo.css";

const Inicio = () => {
  return (
    <div className="inicio-container">
      <header className="header">
        <div className="header-content">
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-text">
            <h1 id="hero-title">
              Anticípate a los <br /> Sismos con <br /> <span>Inteligencia Artificial</span>
            </h1>
            <p>
              Consulta análisis sísmicos detallados de tu región, basados en inteligencia artificial, datos históricos y modelos predictivos. Explora zonas de riesgo, revisa tendencias y toma decisiones informadas con una plataforma diseñada para ofrecer claridad, seguridad y precisión.
            </p>
            <button type="button" aria-label="Explorar servicios">Explorar</button>
          </div>
          <div className="hero-image">
            <div className="image-placeholder"></div>
          </div>
        </section>

        <section className="services" aria-labelledby="services-title">
          <h2 id="services-title">Nuestros Servicios</h2>
          <div className="cards">
            <div className="card" role="article" aria-label="Servicio 1">
              <div className="card-content">
                <h3>Análisis Predictivo</h3>
                <p>Predicciones precisas basadas en datos históricos y modelos de IA avanzados.</p>
              </div>
            </div>
            <div className="card" role="article" aria-label="Servicio 2">
              <div className="card-content">
                <h3>Mapas de Riesgo</h3>
                <p>Visualización interactiva de zonas de riesgo sísmico en tiempo real.</p>
              </div>
            </div>
            <div className="card" role="article" aria-label="Servicio 3">
              <div className="card-content">
                <h3>Reportes Detallados</h3>
                <p>Informes completos con análisis y recomendaciones personalizadas.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="details">
          <div className="detail-block">
            <div className="detail-content">
              <div className="detail-text">
                <h3>Ingeniería de datos aplicada a fenómenos sísmicos</h3>
                <p>Nuestro sistema recopila, clasifica y procesa miles de datos geofísicos con IA para ofrecerte predicciones más confiables.</p>
              </div>
              <div className="detail-image">
                <div className="image-placeholder"></div>
              </div>
            </div>
          </div>
          <div className="detail-block">
            <div className="detail-content reverse">
              <div className="detail-text">
                <h3>Visualización interactiva y mapas de riesgo</h3>
                <p>Explora mapas dinámicos que muestran puntos críticos, frecuencias y probabilidad de actividad sísmica.</p>
              </div>
              <div className="detail-image">
                <div className="image-placeholder"></div>
              </div>
            </div>
          </div>
          <div className="about">
            <div className="about-content">
              <h4>Sobre nosotros</h4>
              <h3>Un proyecto con propósito y aprendizaje real</h3>
              <p>
                Este proyecto nace como parte del curso de Machine Learning en Senati, con el objetivo de aplicar modelos de aprendizaje automático a un problema real: la predicción y el análisis de actividad sísmica.
                Hemos desarrollado un sistema que recopila datos geofísicos, los procesa con algoritmos de IA, y visualiza zonas de riesgo sísmico. Este proyecto representa no solo una iniciativa académica, sino una apuesta por la tecnología al servicio de la prevención.
              </p>
            </div>
            <div className="about-images">
              <div className="image-placeholder"></div>
              <div className="image-placeholder"></div>
              <div className="image-placeholder"></div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <p>© 2025 <strong>LOGITO</strong>. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;