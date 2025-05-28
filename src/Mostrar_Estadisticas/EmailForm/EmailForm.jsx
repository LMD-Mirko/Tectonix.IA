import React, { useState, useEffect } from 'react';
import styles from './EmailForm.module.css';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'JHVEyV4dM_oxJEYlF',
  SERVICE_ID: 'service_xl34bth',
  TEMPLATE_ID: 'template_23ywv4k'
};

// Helper para formatear estadísticas
const formatearEstadisticas = (stats) => {
  if (!stats || Object.keys(stats).length === 0) {
    return 'No hay datos disponibles.';
  }
  return Object.entries(stats)
    .map(([key, value]) => `${key}: ${value} sismos`)
    .join('\n');
};

const EmailForm = ({ datosEstadisticos, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [estado, setEstado] = useState({
    cargando: false,
    exito: false,
    error: null,
  });

  // Inicializar EmailJS
  useEffect(() => {
    try {
      if (!EMAILJS_CONFIG.PUBLIC_KEY) {
        throw new Error('La Public Key de EmailJS es requerida');
      }
      
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('EmailJS inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar EmailJS:', error);
      setEstado(prev => ({
        ...prev,
        error: 'Error al inicializar el servicio de email. Por favor, verifica la Public Key.'
      }));
    }
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setEstado({ cargando: true, exito: false, error: null });

    // Validar que datosEstadisticos esté disponible
    if (!datosEstadisticos) {
      setEstado({
        cargando: false,
        exito: false,
        error: 'No hay datos estadísticos disponibles para enviar'
      });
      return;
    }

    // Validaciones
    if (!formData.name.trim()) {
      setEstado({
        cargando: false,
        exito: false,
        error: 'Por favor, ingresa tu nombre'
      });
      return;
    }

    if (!formData.email.trim()) {
      setEstado({
        cargando: false,
        exito: false,
        error: 'Por favor, ingresa tu correo electrónico'
      });
      return;
    }

    if (!validarEmail(formData.email)) {
      setEstado({
        cargando: false,
        exito: false,
        error: 'Por favor, ingresa un correo electrónico válido'
      });
      return;
    }

    try {
      const templateParams = {
        to_name: formData.name,
        email: formData.email,
        from_name: "Sistema de Monitoreo Sísmico",
        departamento: datosEstadisticos.departamento || 'Todo Perú',
        fechaInicio: datosEstadisticos.fechaInicio || 'N/A',
        fechaFin: datosEstadisticos.fechaFin || 'N/A',
        totalSismos: datosEstadisticos.totalSismos || 0,
        ultimoSismoFecha: datosEstadisticos.ultimoSismo?.fecha || 'N/A',
        ultimoSismoHora: datosEstadisticos.ultimoSismo?.hora || 'N/A',
        ultimoSismoMagnitud: datosEstadisticos.ultimoSismo?.magnitud || 'N/A',
        ultimoSismoProfundidad: datosEstadisticos.ultimoSismo?.profundidad || 'N/A',
        ultimoSismoLatitud: datosEstadisticos.ultimoSismo?.latitud || 'N/A',
        ultimoSismoLongitud: datosEstadisticos.ultimoSismo?.longitud || 'N/A',
        ultimoSismoIntensidad: datosEstadisticos.ultimoSismo?.intensidad || 'N/A',
        ultimoSismoRegion: datosEstadisticos.ultimoSismo?.region || 'N/A',
        estadisticasPorRegion: formatearEstadisticas(datosEstadisticos.estadisticas?.porRegion),
        estadisticasPorIntensidad: formatearEstadisticas(datosEstadisticos.estadisticas?.porIntensidad),
        estadisticasPorProfundidad: formatearEstadisticas(datosEstadisticos.estadisticas?.porProfundidad),
        estadisticasPorMes: formatearEstadisticas(datosEstadisticos.estadisticas?.porMes),
      };

      console.log('Enviando email con parámetros:', templateParams);

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Respuesta de EmailJS:', response);

      if (response.status === 200) {
        setEstado({ cargando: false, exito: true, error: null });
        setFormData({ name: '', email: '' });
        // Cerrar el formulario después de 2 segundos si el envío fue exitoso
        setTimeout(() => {
          onClose?.();
        }, 2000);
      } else {
        throw new Error('Error inesperado al enviar el correo');
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      setEstado({ 
        cargando: false, 
        exito: false, 
        error: 'Error al enviar el correo. Por favor, intenta nuevamente.' 
      });
    }
  };

  return (
    <div className={styles.contenedor}>
      <div className={styles.contenidoPrincipal}>
        <div className={styles.seccionIzquierda}>
          <div className={styles.contenedorImagen}>
            <img 
              src="https://i.pinimg.com/736x/2e/63/dd/2e63dd89efb8765e0cab79d79ce3651f.jpg" 
              alt="Monitoreo Sísmico" 
            />
            <div className={styles.overlayImagen}>
              <h2>Monitoreo Sísmico en Tiempo Real</h2>
              <p>Mantente informado sobre la actividad sísmica en tu región</p>
            </div>
          </div>

          <div className={styles.contenedorEstadisticas}>
            <div className={styles.tarjetaEstadistica}>
              <div className={styles.iconoEstadistica}>📡</div>
              <div className={styles.contenidoEstadistica}>
                <span className={styles.numeroEstadistica}>24/7</span>
                <span className={styles.etiquetaEstadistica}>Monitoreo Continuo</span>
              </div>
            </div>

            <div className={styles.tarjetaEstadistica}>
              <div className={styles.iconoEstadistica}>🎯</div>
              <div className={styles.contenidoEstadistica}>
                <span className={styles.numeroEstadistica}>99.9%</span>
                <span className={styles.etiquetaEstadistica}>Precisión</span>
              </div>
            </div>

            <div className={styles.tarjetaEstadistica}>
              <div className={styles.iconoEstadistica}>📊</div>
              <div className={styles.contenidoEstadistica}>
                <span className={styles.numeroEstadistica}>100+</span>
                <span className={styles.etiquetaEstadistica}>Sensores Activos</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.seccionDerecha}>
          <div className={styles.contenedorFormulario}>
            <div className={styles.encabezadoFormulario}>
              <h2>Recibe las Estadísticas por Correo</h2>
              <p>Ingresa tus datos para recibir un reporte detallado de las estadísticas sísmicas.</p>
            </div>
            
            <form onSubmit={manejarEnvio} className={styles.formulario}>
              <div className={styles.grupoInput}>
                <label htmlFor="name">Nombre</label>
                <div className={styles.contenedorInput}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={manejarCambio}
                    required
                    placeholder="Tu nombre"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.grupoInput}>
                <label htmlFor="email">Correo Electrónico</label>
                <div className={styles.contenedorInput}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={manejarCambio}
                    required
                    placeholder="tu@email.com"
                    className={styles.input}
                  />
                </div>
              </div>

              {estado.error && (
                <div className={styles.mensajeError}>
                  <span className={styles.iconoError}>⚠</span>
                  <p>{estado.error}</p>
                </div>
              )}

              {estado.exito && (
                <div className={styles.mensajeExito}>
                  <span className={styles.iconoExito}>✓</span>
                  <p>¡Estadísticas enviadas exitosamente!</p>
                </div>
              )}

              <div className={styles.grupoBotones}>
                <button 
                  type="submit" 
                  className={styles.botonEnviar}
                  disabled={estado.cargando}
                >
                  {estado.cargando ? 'Enviando...' : 'Enviar Estadísticas'}
                  <span className={styles.iconoBoton}>→</span>
                </button>

                <button 
                  type="button" 
                  className={styles.botonCancelar}
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;