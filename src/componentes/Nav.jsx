import React, { useState, useEffect } from "react";
import { List, X } from "phosphor-react";
import styles from "./Nav.module.css";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Actualizar sección activa basada en el scroll
      const sections = ["inicio", "servicios", "mapa", "consulta", "about"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { id: "inicio", label: "Inicio", href: "#inicio" },
    { id: "servicios", label: "Servicios", href: "#servicios" },
    { id: "mapa", label: "Mapa Predictivo", href: "#mapa" },
    { id: "consulta", label: "Consulta", href: "#consulta" },
    { id: "about", label: "Sobre Nosotros", href: "#about" }
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navHeight = document.querySelector(`.${styles.nav}`).offsetHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <a 
          href="#inicio" 
          className={styles.logo}
          onClick={(e) => handleLinkClick(e, "#inicio")}
        >
          TECTONIX<span className={styles.logoAccent}>.IA</span>
        </a>

        <div className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`${styles.navLink} ${activeSection === link.id ? styles.active : ""}`}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Nav; 