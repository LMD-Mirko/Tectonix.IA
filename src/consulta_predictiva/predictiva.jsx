import React, { useState, useEffect } from 'react';
import styles from './predictiva.module.css';

function Predictiva() {
  const [searchTerm, setSearchTerm] = useState('');
  const [predictedSymptom, setPredictedSymptom] = useState('');
  const [clickEffects, setClickEffects] = useState([]);

  const handleSearch = () => {
    // Lógica para buscar por ubicación
    console.log('Buscando en ubicación:', searchTerm);
  };

  const handlePredict = () => {
    // Lógica para predecir posibles sismos
    setPredictedSymptom('RIESGO DE SISMO EN: ' + searchTerm);
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newEffect = {
      id: Date.now(),
      x,
      y,
    };
    
    setClickEffects(prev => [...prev, newEffect]);
    
    // Limpiar el efecto después de 3 segundos
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 3000);
  };

  return (
    <div className={styles.app} onClick={handleClick}>
      <div className={styles.radarCircles}>
        <span></span>
      </div>
      <div className={styles.radarLines}></div>
      <div className={styles.earthquakePoints}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {clickEffects.map(effect => (
        <div
          key={effect.id}
          className={styles.clickEffect}
          style={{
            left: effect.x,
            top: effect.y,
          }}
        />
      ))}
      <div className={styles.container}>
        <h1>Sistema de Predicción de Sismos</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Ingrese una ubicación (ej: Lima, Perú)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Buscar Ubicación</button>
          <button onClick={handlePredict}>Predecir Sismo</button>
        </div>
        <div className={styles.resultContainer}>
          <h2>{predictedSymptom || 'RIESGO DE SISMO EN:'}</h2>
          <div className={styles.dottedLine}></div>
          <p>Ingrese una ubicación para obtener la predicción de riesgo sísmico</p>
        </div>
      </div>
    </div>
  );
}

export default Predictiva;