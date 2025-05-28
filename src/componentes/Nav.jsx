import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { List, X } from "phosphor-react";
import styles from "./Nav.module.css";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (location.pathname === "/") {
        const sections = ["inicio", "servicios", "consulta", "about"];
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
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const links = [
    { id: "inicio", label: "Inicio", href: "#inicio", isRoute: false },
    { id: "servicios", label: "Servicios", href: "#servicios", isRoute: false },
    { id: "about", label: "Sobre Nosotros", href: "#about", isRoute: false },
    { id: "mapa", label: "Gráfico", href: "/mapa", isRoute: true },
    { id: "mapa", label: "Mapa", href: "/mapac", isRoute: true },
    { id: "consulta", label: "Predecir", href: "/consulta", isRoute: true },
    { id: "chatbot", label: "TectonixBot", href: "/chatbot", isRoute: true }
    
  ];

  const scrollToSection = (hash) => {
    const element = document.querySelector(hash);
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

  const handleLinkClick = (e, href, isRoute) => {
    if (isRoute) {
      setIsOpen(false);
      return;
    }

    if (href.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);

      if (location.pathname === "/") {
        scrollToSection(href);
      } else {
        navigate("/", { replace: false });
        setTimeout(() => {
          scrollToSection(href);
        }, 100);
      }
    }
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        <Link
          to="/"
          className={styles.logo}
          onClick={() => setIsOpen(false)}
        >
          TECTONIX<span className={styles.logoAccent}>.IA</span>
        </Link>

        <div className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
          {links.map((link) =>
            link.isRoute ? (
              <Link
                key={link.id}
                to={link.href}
                className={`${styles.navLink} ${location.pathname === link.href ? styles.active : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.id}
                href={link.href}
                className={`${styles.navLink} ${activeSection === link.id ? styles.active : ""}`}
                onClick={(e) => handleLinkClick(e, link.href, link.isRoute)}
              >
                {link.label}
              </a>
            )
          )}
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
