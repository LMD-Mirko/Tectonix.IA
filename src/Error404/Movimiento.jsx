import React, { useEffect, useRef } from "react";

const FondoAnimado = () => {
  const canvasRef = useRef(null);
  const particulas = useRef([]);

  useEffect(() => {
    const lienzo = canvasRef.current;
    const contexto = lienzo.getContext("3d");
    let idAnimacion;

    const redimensionarLienzo = () => {
      lienzo.width = window.innerWidth;
      lienzo.height = window.innerHeight;
    };

    const crearParticulas = () => {
      const cantidadParticulas = 150; // Aumenté el número de partículas normales
      particulas.current = [];

      for (let i = 0; i < cantidadParticulas; i++) {
        particulas.current.push({
          x: Math.random() * lienzo.width,
          y: Math.random() * lienzo.height,
          tamano: Math.random() * 7 + 2, // Tamaño un poco más grande
          velocidadX: (Math.random() * 3 - 1.5) * 1.5,
          velocidadY: (Math.random() * 3 - 1.5) * 1.5,
          opacidad: Math.random() * 0.6 + 0.3,
          color: `rgba(${Math.floor(Math.random() * 100 + 155)}, 
                  ${Math.floor(Math.random() * 100 + 155)}, 
                  ${Math.floor(Math.random() * 100 + 155)}, 
                  ${Math.random() * 0.6 + 0.3})` // Colores aleatorios claros
        });
      }
    };

    const dibujarParticulas = () => {
      contexto.clearRect(0, 0, lienzo.width, lienzo.height);

      // Dibujar todas las partículas
      particulas.current.forEach((particula) => {
        contexto.beginPath();
        contexto.arc(
          particula.x,
          particula.y,
          particula.tamano,
          0,
          Math.PI * 2
        );
        contexto.fillStyle = particula.color;
        contexto.fill();

        // Actualizar posición
        particula.x += particula.velocidadX;
        particula.y += particula.velocidadY;

        // Rebote en los bordes
        if (particula.x < 0 || particula.x > lienzo.width) {
          particula.velocidadX *= -1;
        }
        if (particula.y < 0 || particula.y > lienzo.height) {
          particula.velocidadY *= -1;
        }
      });

      // Dibujar conexiones entre partículas
      particulas.current.forEach((particula1, i) => {
        particulas.current.slice(i + 1).forEach((particula2) => {
          const dx = particula1.x - particula2.x;
          const dy = particula1.y - particula2.y;
          const distancia = Math.sqrt(dx * dx + dy * dy);

          if (distancia < 150) {
            contexto.beginPath();
            contexto.moveTo(particula1.x, particula1.y);
            contexto.lineTo(particula2.x, particula2.y);
            contexto.strokeStyle = `rgba(200, 200, 255, ${
              0.2 * (1 - distancia / 150)
            })`;
            contexto.lineWidth = 1;
            contexto.stroke();
          }
        });
      });

      idAnimacion = requestAnimationFrame(dibujarParticulas);
    };

    // Configuración inicial
    window.addEventListener("resize", redimensionarLienzo);
    redimensionarLienzo();
    crearParticulas();
    dibujarParticulas();

    // Limpieza
    return () => {
      window.removeEventListener("resize", redimensionarLienzo);
      cancelAnimationFrame(idAnimacion);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(25, 26, 27) 100%)" // Fondo oscuro degradado
      }}
    />
  );
};

export default FondoAnimado;