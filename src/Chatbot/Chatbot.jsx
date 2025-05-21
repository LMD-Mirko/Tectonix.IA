import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Paper, Typography, IconButton, TextField, Button, Avatar, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WavesIcon from '@mui/icons-material/Waves';
import axios from 'axios';
import estilo from './Chatbot.module.css';
import SeismicBackground from '../movimiento/AnimatedBackground';

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-dd640.up.railway.app/api';

export default function SismoBot() {
  const [mensajeUsuario, setMensajeUsuario] = useState('');
  const [mensajes, setMensajes] = useState([
    {
      tipo: 'ia',
      texto: '¡Hola! Soy TectonixBot, tu asistente virtual para información sobre sismos y terremotos. ¿En qué puedo ayudarte?',
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
        const response = await axios.get(`${API_URL}/status`);
        setErrorConexion(!response.data.apiConectada);
        setEstadoServidor({ 
          status: response.data.status, 
          mensaje: response.data.apiConectada ? 'Conectado' : 'API desconectada'
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
    const intervalo = setInterval(verificarServidor, 60000);
    
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
      const response = await axios.post(`${API_URL}/chat`, {
        mensaje: mensajeParaEnviar,
      }, {
        timeout: 30000 
      });

      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { 
          tipo: 'ia', 
          texto: response.data.respuesta,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } catch (error) {
      console.error('Error al obtener la respuesta:', error);
      
      let mensajeError = 'Lo siento, hubo un error al procesar tu solicitud.';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        mensajeError = 'No puedo conectarme al servidor. ¿El servidor está ejecutándose?';
        setErrorConexion(true);
      } else if (error.response) {
        switch(error.response.status) {
          case 500:
            mensajeError = 'Hay un problema con el servicio de IA. El equipo técnico ha sido notificado.';
            break;
          case 503:
            mensajeError = 'El servicio de IA no está disponible en este momento. Por favor, intenta más tarde.';
            break;
          case 504:
            mensajeError = 'La respuesta está tomando demasiado tiempo. Por favor, intenta con una pregunta más corta.';
            break;
          default:
            mensajeError = `Error ${error.response.status}: ${error.response.data.mensaje || 'Error desconocido'}`;
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
      const response = await axios.post(`${API_URL}/chat/reiniciar`);
      
      setMensajes([
        {
          tipo: 'ia',
          texto: response.data.respuesta || '¡Conversación reiniciada! ¿En qué puedo ayudarte con información sísmica?',
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
      
      await verificarEstadoServidor();
    } catch (error) {
      console.error('Error al reiniciar chat:', error);
      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { 
          tipo: 'ia', 
          texto: 'Hubo un problema al reiniciar la conversación.', 
          esError: true,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        },
      ]);
    }
  };

  const verificarEstadoServidor = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`);
      setErrorConexion(!response.data.apiConectada);
      return response.data.apiConectada;
    } catch (error) {
      console.error('Error al verificar estado:', error);
      setErrorConexion(true);
      return false;
    }
  };

  const sugerencias = [
    "Zonas sísmicas en Perú",
    "Preparación ante terremotos",
    "Últimos sismos registrados en Perú",
    "¿Cómo se forman los terremotos?",
    "¿Cómo actuar durante un terremoto?"
  ];

  const usarSugerencia = (sugerencia) => {
    setMensajeUsuario(sugerencia);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRegresar = () => {

    window.history.back();
  };

  return (
  <Box className={estilo.chatContainer}>
    {/* Botón REGRESAR siempre visible por encima de todo */}
    <Box className={estilo.botonRegresarWrapper}>
      <button className={estilo.botonRegresar} onClick={handleRegresar}>
        REGRESAR
      </button>
    </Box>

    <div className={estilo.seismicOverlay}></div>
    <div className={estilo.gridBackground}></div>
    <SeismicBackground />

    {/* Centrado absoluto del chat */}
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Paper className={estilo.chatPaper} elevation={3}>
        {/* Header */}
        <Box className={estilo.chatHeader}>
          <Box className={estilo.headerLeftContent}>
            <Avatar className={estilo.botAvatar}>
              <WavesIcon className={estilo.botIcon} />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h1" className={estilo.headerTitle}>
                TectonixBot
              </Typography>
              <Typography variant="body2" className={estilo.headerSubtitle}>
                Sistema de monitoreo sísmico
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
            >
              <RestartAltIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Chat Mensages*/}
        <Box
          ref={chatBodyRef}
          className={estilo.chatBody}
        >
          {mensajes.map((mensaje, index) => (
            <Box
              key={index}
              className={`${estilo.messageBubble} ${mensaje.tipo === 'usuario' ? estilo.userMessage : estilo.botMessage}`}
            >
              <Typography variant="body1" className={estilo.messageText}>
                {mensaje.texto}
              </Typography>
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
  </Box>
);

}