import React, { useState, useEffect } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";
import styles from "./HeroCarousel.module.css";
import mapaImg from "../inicio/img/landscape-lights-sea-Italy-night-water-23628-wallhere.com.jpg";
import mapaImg2 from "../inicio/img/dario-bronnimann-CpIEyqdwygY-unsplash.jpg";
import mapaImg3 from "../inicio/img/nastya-dulhiier-hTqezq8WXR8-unsplash (1).jpg";
import educacionImg from "../inicio/img/kamran-abdullayev-okkwqpKX2qw-unsplash.jpg";
import riesgoImg from "../inicio/img/mariola-grobelska-KFQPK9Pow5k-unsplash.jpg";
import sensoresImg from "../inicio/img/javier-miranda-nc1zsYGkLFA-unsplash.jpg";
const slides = [
  {
    title: "Predicción Sísmica",
    subtitle: "Anticípate a los sismos con Inteligencia Artificial",
    description:
      "Nuestro sistema analiza miles de datos geofísicos para ofrecerte predicciones más confiables.",
    image: mapaImg,
  },
  {
    title: "Análisis en Tiempo Real",
    subtitle: "Monitoreo continuo de actividad sísmica",
    description:
      "Visualiza y analiza la actividad sísmica de tu región en tiempo real con mapas interactivos.",
    image: mapaImg2,
  },
  {
    title: "Tecnología Avanzada",
    subtitle: "Machine Learning para la prevención",
    description:
      "Utilizamos algoritmos de última generación para procesar y analizar datos sísmicos.",
    image: mapaImg3,
  },
  {
    title: "Educación y Prevención",
    subtitle: "Infórmate y prepárate ante un sismo",
    description:
      "Accede a guías prácticas, simulacros y recursos para estar listo ante cualquier emergencia.",
    image: educacionImg,
  },
  {
    title: "Mapa de Riesgos",
    subtitle: "Conoce las zonas más vulnerables",
    description:
      "Consulta mapas de riesgo sísmico detallados por regiones y planifica mejor tu seguridad.",
    image: riesgoImg,
  },
  {
    title: "Red de Sensores",
    subtitle: "Miles de sensores conectados al instante",
    description:
      "Detectamos movimientos sísmicos en segundos gracias a una red de monitoreo distribuida.",
    image: sensoresImg,
  },
];


const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.slides}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentSlide ? styles.active : ""
            }`}
          >
            <div className={styles.slideBackground}>
              <img
                src={slide.image}
                alt={slide.title}
                className={styles.slideImage}
              />
            </div>
            <div className={styles.slideContent}>
              <h1 className={styles.title}>{slide.title}</h1>
              <h2 className={styles.subtitle}>{slide.subtitle}</h2>
              <p className={styles.description}>{slide.description}</p>
              <a href="#servicios" className={styles.ctaButton}>
                Explorar
              </a>
            </div>
          </div>
        ))}
      </div>

      <button className={`${styles.navButton} ${styles.prev}`} onClick={prevSlide}>
        <CaretLeft size={32} weight="bold" />
      </button>
      <button className={`${styles.navButton} ${styles.next}`} onClick={nextSlide}>
        <CaretRight size={32} weight="bold" />
      </button>

      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === currentSlide ? styles.active : ""
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;