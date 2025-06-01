import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { List, X, GithubLogo, ChartLine, MapPin, Robot, House, Info } from "phosphor-react";
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
    { id: "inicio", label: "Inicio", href: "#inicio", isRoute: false, icon: <House size={20} weight="fill" /> },
    { id: "servicios", label: "Servicios", href: "#servicios", isRoute: false, icon: <Info size={20} weight="fill" /> },
    { id: "about", label: "Sobre Nosotros", href: "#about", isRoute: false, icon: <Info size={20} weight="fill" /> },
    { id: "mapa", label: "Gráfico", href: "/mapa", isRoute: true, icon: <ChartLine size={20} weight="fill" /> },
    { id: "mapa", label: "Mapa", href: "/mapac", isRoute: true, icon: <MapPin size={20} weight="fill" /> },
    { id: "consulta", label: "Predecir", href: "/consulta", isRoute: true, icon: <ChartLine size={20} weight="fill" /> },
    { id: "chatbot", label: "TectonixBot", href: "/chatbot", isRoute: true, icon: <Robot size={20} weight="fill" /> }
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
          <span className={styles.logoText}>TECTONIX</span>
          <span className={styles.logoAccent}>.IA</span>
          <div className={styles.logoGlow}></div>
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
                <span className={styles.navIcon}>{link.icon}</span>
                {link.label}
              </Link>
            ) : (
              <a
                key={link.id}
                href={link.href}
                className={`${styles.navLink} ${activeSection === link.id ? styles.active : ""}`}
                onClick={(e) => handleLinkClick(e, link.href, link.isRoute)}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                {link.label}
              </a>
            )
          )}
        </div>

        <div className={styles.navActions}>
          <a
            href="https://github.com/LMD-Mirko/Tectonix.IA"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            aria-label="GitHub Repository"
          >
            <GithubLogo size={24} weight="fill" />
            <span className={styles.githubGlow}></span>
          </a>
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
