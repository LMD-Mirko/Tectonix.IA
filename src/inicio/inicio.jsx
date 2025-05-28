import React from "react";
import { ChartLine, MapPin, Brain, Shield, Database, Globe } from "phosphor-react";
import Nav from "../componentes/Nav";
import HeroCarousel from "../componentes/HeroCarousel";
import investigacionImg from "../inicio/img/investigacion.jpeg";
import styles from "./inicio.module.css";

const servicios = [
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

const caracteristicas = [
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
    <div className={styles.contenedorApp}>
      <Nav />
      
      {/* Hero Section with Carousel */}
      <section className={styles.seccionHero} id="inicio">
        <HeroCarousel />
      </section>

      {/* Services Section */}
      <section className={styles.seccionServicios} id="servicios">
        <div className={styles.encabezadoSeccion}>
          <h2 className={styles.textoGradiente}>Nuestros Servicios</h2>
          <p className={styles.subtituloSeccion}>
            Soluciones tecnológicas avanzadas para la predicción y análisis sísmico
          </p>
        </div>
        <div className={styles.contenedorServicios}>
          {servicios.map((s, i) => (
            <div className={styles.tarjetaServicio} key={i}>
              <div className={styles.iconoServicio}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.seccionCaracteristicas}>
        <div className={styles.encabezadoSeccion}>
          <h2 className={styles.textoGradiente}>Características Principales</h2>
          <p className={styles.subtituloSeccion}>
            Tecnología de vanguardia al servicio de la prevención
          </p>
        </div>
        <div className={styles.contenedorCaracteristicas}>
          {caracteristicas.map((f, i) => (
            <div className={styles.tarjetaCaracteristica} key={i}>
              <div className={styles.iconoCaracteristica}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className={styles.seccionAcerca} id="about">
        <div className={styles.contenedorAcerca}>
          <div className={styles.contenidoAcerca}>
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
          <div className={styles.imagenAcerca}>
            <img src={investigacionImg} alt="Tectonix IA Team" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.piePagina}>
        <div className={styles.contenidoPiePagina}>
          <span className={styles.logoPiePagina}>TECTONIX<span className={styles.accentLogo}>.IA</span></span>
          <span className={styles.copyrightPiePagina}>© 2025 TECTONIX.IA. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}