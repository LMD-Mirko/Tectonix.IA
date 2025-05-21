import React from "react";
import { ChartLine, MapPin, Brain, Shield, Database, Globe } from "phosphor-react";
import Nav from "../componentes/Nav";
import HeroCarousel from "../componentes/HeroCarousel";
import investigacionImg from "../inicio/img/investigacion.jpeg";
import styles from "./inicio.module.css";

const services = [
  {
    icon: <Brain size={36} weight="duotone" />,
    title: "Ingeniería de datos aplicada a fenómenos sísmicos",
    desc: "Nuestro sistema recopila, clasifica y procesa miles de datos geofísicos con IA para ofrecerte predicciones más confiables."
  },
  {
    icon: <MapPin size={36} weight="duotone" />,
    title: "Visualización interactiva y mapas de riesgo",
    desc: "Explora mapas dinámicos que muestran puntos críticos, frecuencias y probabilidad de actividad sísmica."
  },
  {
    icon: <ChartLine size={36} weight="duotone" />,
    title: "Consulta predictiva",
    desc: "Consulta análisis sísmicos detallados de tu región, basados en IA, datos históricos y modelos predictivos."
  }
];

const features = [
  {
    icon: <Shield size={36} weight="duotone" />,
    title: "Prevención Avanzada",
    desc: "Sistema de alerta temprana basado en IA para anticipar eventos sísmicos."
  },
  {
    icon: <Database size={36} weight="duotone" />,
    title: "Big Data",
    desc: "Procesamiento de millones de datos sísmicos en tiempo real."
  },
  {
    icon: <Globe size={36} weight="duotone" />,
    title: "Cobertura Global",
    desc: "Monitoreo de actividad sísmica en todo el mundo."
  }
];

export default function Inicio() {
  return (
    <div className={styles["app-container"]}>
      <Nav />
      
      {/* Hero Section with Carousel */}
      <section className={styles["hero-section"]} id="inicio">
        <HeroCarousel />
      </section>

      {/* Services Section */}
      <section className={styles["servicios-minimal"]} id="servicios">
        <div className={styles["section-header"]}>
          <h2 className={styles["gradient-text"]}>Nuestros Servicios</h2>
          <p className={styles["section-subtitle"]}>
            Soluciones tecnológicas avanzadas para la predicción y análisis sísmico
          </p>
        </div>
        <div className={styles["servicios-grid-minimal"]}>
          {services.map((s, i) => (
            <div className={styles["servicio-card-minimal"]} key={i}>
              <div className={styles["servicio-icon-minimal"]}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles["features-section"]}>
        <div className={styles["section-header"]}>
          <h2 className={styles["gradient-text"]}>Características Principales</h2>
          <p className={styles["section-subtitle"]}>
            Tecnología de vanguardia al servicio de la prevención
          </p>
        </div>
        <div className={styles["features-grid"]}>
          {features.map((f, i) => (
            <div className={styles["feature-card"]} key={i}>
              <div className={styles["feature-icon"]}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* About Section */}
      <section className={styles["about-minimal"]} id="about">
        <div className={styles["about-container"]}>
          <div className={styles["about-content-minimal"]}>
            <h2>Sobre nosotros</h2>
            <p>
              Este proyecto nace como parte del curso de Machine Learning en Senati, con el objetivo de aplicar modelos de aprendizaje automático a un problema real: la predicción y el análisis de actividad sísmica.
            </p>
            <p>
              Hemos desarrollado un sistema que recopila datos geofísicos, los procesa con algoritmos de IA, y visualiza zonas de riesgo sísmico. Este proyecto representa no solo una iniciativa académica, sino una apuesta por la tecnología al servicio de la prevención.
            </p>
            <p>
              Buscamos demostrar cómo el aprendizaje automático puede integrarse a soluciones reales que impacten positivamente en la sociedad.
            </p>
          </div>
          <div className={styles["about-image"]}>
            <img src={investigacionImg} alt="Tectonix IA Team" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles["footer-minimal"]}>
        <div className={styles["footer-content-minimal"]}>
          <span className={styles["footer-logo-minimal"]}>TECTONIX<span className={styles["logo-accent"]}>.IA</span></span>
          <span className={styles["footer-copy-minimal"]}>© 2025 TECTONIX.IA. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}