import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Paper, Typography, IconButton, TextField, Button, Avatar, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WavesIcon from '@mui/icons-material/Waves';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import estilo from './Chatbot.module.css';
import SeismicBackground from '../movimiento/AnimatedBackground';

// URL de tu API local
const API_URL = 'https://web-production-dd640.up.railway.app/api';

export default function SismoBot() {
  const [mensajeUsuario, setMensajeUsuario] = useState('');
  const [mensajes, setMensajes] = useState([
    {
      tipo: 'ia',
      texto: '## 🌍 SismoBot Iniciado\n\n¡Hola! Soy **SismoBot**, tu asistente virtual especializado en información sobre **sismos** y **terremotos**.\n\n¿En qué puedo ayudarte hoy?',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const [cargando, setCargando] = useState(false);
  const [errorConexion, setErrorConexion] = useState(false);
  const [estadoServidor, setEstadoServidor] = useState({ status: 'desconocido', mensaje: '' });
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [mensajes]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const verificarServidor = async () => {
      try {
        // Intentamos hacer una petición simple para verificar si el servidor está activo
        const response = await axios.get(`${API_URL}/status`, { timeout: 5000 });
        setErrorConexion(false);
        setEstadoServidor({ 
          status: 'conectado', 
          mensaje: 'Conectado'
        });
      } catch (error) {
        console.error('Error al verificar estado del servidor:', error);
        setErrorConexion(true);
        setEstadoServidor({ 
          status: 'error', 
          mensaje: 'Servidor desconectado' 
        });
      }
    };
    
    verificarServidor();
    const intervalo = setInterval(verificarServidor, 30000); // Verificar cada 30 segundos
    
    return () => clearInterval(intervalo);
  }, []);

  const manejarTeclaPresionada = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const enviarMensaje = async () => {
    if (!mensajeUsuario.trim() || cargando || errorConexion) return;

    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMensajes((prevMensajes) => [
      ...prevMensajes,
      { tipo: 'usuario', texto: mensajeUsuario, hora: horaActual },
    ]);
    setCargando(true);
    
    const mensajeParaEnviar = mensajeUsuario.trim();
    setMensajeUsuario('');

    try {
      // Usar tu endpoint de chat
      const response = await axios.post(`${API_URL}/chat`, {
        mensaje: mensajeParaEnviar,
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Tu API devuelve la respuesta en formato Markdown
      const respuestaIA = response.data.respuesta || response.data.mensaje || response.data;
      
      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { 
          tipo: 'ia', 
          texto: respuestaIA,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } catch (error) {
      console.error('Error al obtener la respuesta:', error);
      
      let mensajeError = '## 🔧 Error de Conexión\n\nLo siento, hubo un **error** al procesar tu solicitud.';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        mensajeError = '## 🔌 Servidor Desconectado\n\nNo puedo conectarme al servidor. ¿El **servidor** está ejecutándose?';
        setErrorConexion(true);
      } else if (error.response) {
        switch(error.response.status) {
          case 500:
            mensajeError = '## ⚠️ Error del Servidor\n\nHay un **problema** con el servicio de IA. El equipo técnico ha sido notificado.';
            break;
          case 503:
            mensajeError = '## 🚫 Servicio No Disponible\n\nEl servicio de IA **no está disponible** en este momento. Por favor, intenta más tarde.';
            break;
          case 504:
            mensajeError = '## ⏱️ Tiempo Agotado\n\nLa respuesta está tomando **demasiado tiempo**. Por favor, intenta con una pregunta más corta.';
            break;
          case 429:
            mensajeError = '## ⚠️ Servicio Saturado\n\nEstamos experimentando **mucho tráfico** en este momento.\n\n🕐 Por favor, **intenta de nuevo** en unos minutos.';
            break;
          default:
            mensajeError = `## ❌ Error ${error.response.status}\n\n${error.response.data?.mensaje || 'Error desconocido'}`;
        }
      }
      
      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { 
          tipo: 'ia', 
          texto: mensajeError, 
          esError: true,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } finally {
      setCargando(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const reiniciarChat = async () => {
    try {
      // Usar tu endpoint de reiniciar
      const response = await axios.post(`${API_URL}/chat/reiniciar`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const mensajeReinicio = response.data.respuesta || response.data.mensaje || response.data || '## 🌍 Conversación Reiniciada\n\nSoy **SismoBot**. ¿Qué necesitas saber sobre sismos?';
      
      setMensajes([
        {
          tipo: 'ia',
          texto: mensajeReinicio,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
      
      await verificarEstadoServidor();
    } catch (error) {
      console.error('Error al reiniciar chat:', error);
      setMensajes([
        {
          tipo: 'ia',
          texto: '## ❌ Error al Reiniciar\n\nHubo un **problema** al reiniciar la conversación.',
          esError: true,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    }
  };

  const verificarEstadoServidor = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`, { timeout: 5000 });
      setErrorConexion(false);
      return true;
    } catch (error) {
      console.error('Error al verificar estado:', error);
      setErrorConexion(true);
      return false;
    }
  };

  const sugerencias = [
    "Zonas sísmicas en Perú",
    "Preparación ante terremotos",
    "Últimos sismos registrados",
    "¿Cómo se forman los terremotos?",
    "¿Cómo actuar durante un sismo?"
  ];

  const usarSugerencia = (sugerencia) => {
    setMensajeUsuario(sugerencia);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Box className={estilo.chatContainer}>
      <div className={estilo.seismicOverlay}></div>
      <div className={estilo.gridBackground}></div>
      <SeismicBackground />

      <Paper className={estilo.chatPaper} elevation={3}>
        {/* Header */}
        <Box className={estilo.chatHeader}>
          <Box className={estilo.headerLeftContent}>
            <Avatar className={estilo.botAvatar}>
              <WavesIcon className={estilo.botIcon} />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h1" className={estilo.headerTitle}>
                SismoBot
              </Typography>
              <Typography variant="body2" className={estilo.headerSubtitle}>
                Asistente de información sísmica
              </Typography>
            </Box>
          </Box>
          <Box className={estilo.headerRightContent}>
            <Chip
              label={estadoServidor.mensaje}
              size="small"
              variant="outlined"
              className={`${estilo.statusChip} ${
                errorConexion ? estilo.statusChipDisconnected : estilo.statusChipConnected
              }`}
            />
            <IconButton
              onClick={reiniciarChat}
              disabled={errorConexion}
              color="inherit"
              size="small"
              className={estilo.resetButton}
              title="Reiniciar conversación"
            >
              <RestartAltIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Messages */}
        <Box
          ref={chatBodyRef}
          className={estilo.chatBody}
        >
          {mensajes.map((mensaje, index) => (
            <Box
              key={index}
              className={`${estilo.messageBubble} ${mensaje.tipo === 'usuario' ? estilo.userMessage : estilo.botMessage}`}
            >
              <Box className={estilo.messageText}>
                <div className={estilo.markdownContent}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Personalizar componentes para que respeten los estilos del CSS
                      p: ({node, children}) => <p className={estilo.messageParagraph}>{children}</p>,
                      strong: ({node, children}) => <strong className={estilo.boldText}>{children}</strong>,
                      h1: ({node, children}) => <h1 style={{fontSize: '1rem', marginBottom: '0.5em', color: '#00ffcc'}}>{children}</h1>,
                      h2: ({node, children}) => <h2 style={{fontSize: '1rem', marginBottom: '0.5em', color: '#00ffcc'}}>{children}</h2>,
                      h3: ({node, children}) => <h3 style={{fontSize: '1rem', marginBottom: '0.5em', color: '#00ffcc'}}>{children}</h3>,
                      ul: ({node, children}) => <ul style={{marginLeft: '1em', marginBottom: '0.5em'}}>{children}</ul>,
                      ol: ({node, children}) => <ol style={{marginLeft: '1em', marginBottom: '0.5em'}}>{children}</ol>,
                      li: ({node, children}) => <li style={{marginBottom: '0.3em', color: 'inherit'}}>{children}</li>,
                      code: ({node, inline, children}) => 
                        inline ? 
                        <code style={{
                          backgroundColor: 'rgba(0, 255, 204, 0.1)',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          fontSize: '0.85em'
                        }}>{children}</code> :
                        <pre style={{
                          backgroundColor: '#0f0f0f',
                          padding: '1em',
                          borderRadius: '8px',
                          overflow: 'auto',
                          margin: '1em 0'
                        }}><code>{children}</code></pre>
                    }}
                  >
                    {mensaje.texto}
                  </ReactMarkdown>
                </div>
              </Box>
              <Typography
                variant="caption"
                className={`${estilo.messageTime} ${mensaje.tipo === 'usuario' ? estilo.userMessageTime : estilo.botMessageTime}`}
              >
                {mensaje.hora}
              </Typography>
            </Box>
          ))}
          {cargando && (
            <Box className={estilo.typingIndicator}>
              <div className={estilo.typingDot}></div>
              <div className={estilo.typingDot}></div>
              <div className={estilo.typingDot}></div>
            </Box>
          )}
        </Box>

        {/* Suggestion Area */}
        <Box className={estilo.suggestionsArea}>
          <Box className={estilo.suggestionChipsContainer}>
            {sugerencias.map((sugerencia, index) => (
              <Chip
                key={index}
                label={sugerencia}
                onClick={() => usarSugerencia(sugerencia)}
                disabled={errorConexion || cargando}
                className={estilo.suggestionChip}
              />
            ))}
          </Box>
        </Box>

        {/* Input Area */}
        <Box className={estilo.inputArea}>
          <TextField
            inputRef={inputRef}
            fullWidth
            variant="outlined"
            placeholder={errorConexion ? "Servidor desconectado..." : "Escribe tu consulta sobre sismos aquí..."}
            value={mensajeUsuario}
            onChange={(e) => setMensajeUsuario(e.target.value)}
            onKeyDown={manejarTeclaPresionada}
            disabled={errorConexion || cargando}
            size="small"
            className={estilo.messageInput}
            multiline
            maxRows={3}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={enviarMensaje}
            disabled={!mensajeUsuario.trim() || cargando || errorConexion}
            className={estilo.sendButton}
          >
            Enviar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}