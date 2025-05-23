import React, { useState, useEffect } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";
import styles from "./HeroCarousel.module.css";
import mapaImg from "../inicio/img/mappa.png";
import mapaImg2 from "../inicio/img/placaas.jpg";
import mapaImg3 from "../inicio/img/placaasd.jpg";

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