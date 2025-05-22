import React, { useState, useEffect } from 'react';
import styles from './EmailForm.module.css';
import emailjs from '@emailjs/browser';
import Nav from '../../componentes/Nav';
import { motion } from 'framer-motion';

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'JHVEyV4dM_oxJEYlF',
  SERVICE_ID: 'service_xl34bth',
  TEMPLATE_ID: 'template_q9vygd1'
};

const EmailForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });
  const [isHovered, setIsHovered] = useState(false);

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
      setStatus(prev => ({
        ...prev,
        error: 'Error al inicializar el servicio de email. Por favor, verifica la Public Key.'
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    // Validaciones
    if (!formData.name.trim()) {
      setStatus({
        loading: false,
        success: false,
        error: 'Por favor, ingresa tu nombre'
      });
      return;
    }

    if (!formData.email.trim()) {
      setStatus({
        loading: false,
        success: false,
        error: 'Por favor, ingresa tu correo electrónico'
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus({
        loading: false,
        success: false,
        error: 'Por favor, ingresa un correo electrónico válido'
      });
      return;
    }

    try {
      const templateParams = {
        from_name: "Sistema de Monitoreo Sísmico",
        to_name: formData.name,
        to_email: formData.email,
        email: formData.email,
        reply_to: "no-reply@seismicmonitoring.com",
        date: getCurrentDate(),
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h1 style="color: #000000; text-align: center; border-bottom: 2px solid #000000; padding-bottom: 10px;">
              📊 Actualización de Estadísticas – Proyecto de Monitoreo Sísmico 🌍
            </h1>

            <p style="font-size: 16px; line-height: 1.6;">
              Hola <strong>${formData.name}</strong> 👋,<br><br>
              Espero que estés teniendo un excelente día.<br>
              Te comparto el reporte actualizado del proyecto Monitoreo Sísmico 📡 correspondiente a la fecha <strong>${getCurrentDate()}</strong>.
            </p>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 2px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <h2 style="color: #000000; margin-top: 0;">🔎 Resumen General</h2>
              
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 2px; border: 1px solid #e0e0e0;">
                  📌 <strong>Eventos sísmicos registrados:</strong> ###
                </li>
                <li style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 2px; border: 1px solid #e0e0e0;">
                  📈 <strong>Magnitud promedio:</strong> #.# Mw
                </li>
                <li style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 2px; border: 1px solid #e0e0e0;">
                  📍 <strong>Zona con mayor actividad:</strong> Región / Coordenadas
                </li>
              </ul>
            </div>
          </div>
        `,
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '' });
      } else {
        throw new Error('Error inesperado al enviar el correo');
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      setStatus({ 
        loading: false, 
        success: false, 
        error: 'Error al enviar el correo. Por favor, intenta nuevamente.' 
      });
    }
  };

  return (
    <div className={styles.container}>
      <Nav />
      
      <div className={styles.mainContent}>
        <div className={styles.leftSection}>
          <motion.div 
            className={styles.imageContainer}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className={styles.imageWrapper}>
              <img 
                src="https://i.pinimg.com/736x/2e/63/dd/2e63dd89efb8765e0cab79d79ce3651f.jpg" 
                alt="Monitoreo Sísmico" 
                className={styles.image}
              />
              <div className={styles.imageOverlay}>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Monitoreo Sísmico en Tiempo Real
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Mantente informado sobre la actividad sísmica en tu región
                </motion.p>
              </div>
            </div>
          </motion.div>

          <div className={styles.statsContainer}>
            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.statIcon}>📡</div>
              <div className={styles.statContent}>
                <span className={styles.statNumber}>24/7</span>
                <span className={styles.statLabel}>Monitoreo Continuo</span>
              </div>
            </motion.div>

            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statContent}>
                <span className={styles.statNumber}>99.9%</span>
                <span className={styles.statLabel}>Precisión</span>
              </div>
            </motion.div>

            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statContent}>
                <span className={styles.statNumber}>100+</span>
                <span className={styles.statLabel}>Sensores Activos</span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className={styles.rightSection}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Recibe las Estadísticas por Correo
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Ingresa tus datos para recibir un reporte detallado de las estadísticas sísmicas.
              </motion.p>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <motion.div 
                className={styles.inputGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <label htmlFor="name">Nombre</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className={styles.input}
                  />
                  <span className={styles.inputFocusBorder}></span>
                </div>
              </motion.div>

              <motion.div 
                className={styles.inputGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <label htmlFor="email">Correo Electrónico</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className={styles.input}
                  />
                  <span className={styles.inputFocusBorder}></span>
                </div>
              </motion.div>

              <motion.button 
                type="submit" 
                className={styles.submitButton}
                disabled={status.loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <span className={styles.buttonText}>
                  {status.loading ? 'Enviando...' : 'Enviar Estadísticas'}
                </span>
                <span className={`${styles.buttonIcon} ${isHovered ? styles.buttonIconHovered : ''}`}>
                  →
                </span>
              </motion.button>

              {status.success && (
                <motion.div 
                  className={styles.successMessage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className={styles.successIcon}>✓</span>
                  <p>¡Estadísticas enviadas exitosamente!</p>
                </motion.div>
              )}

              {status.error && (
                <motion.div 
                  className={styles.errorMessage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className={styles.errorIcon}>⚠</span>
                  <p>{status.error}</p>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailForm;