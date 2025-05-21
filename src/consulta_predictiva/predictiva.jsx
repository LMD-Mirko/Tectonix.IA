import React, { useState, useEffect } from 'react';
import styles from '../consulta_predictiva/predictiva.module.css';
import Nav from '../componentes/Nav';

function Predictiva() {
  const [searchTerm, setSearchTerm] = useState('');
  const [predictedSymptom, setPredictedSymptom] = useState('');
  const [clickEffects, setClickEffects] = useState([]);

  const handleSearch = () => {
    console.log('Buscando en ubicación:', searchTerm);
  };

  const handlePredict = () => {
    setPredictedSymptom('RIESGO DE SISMO EN: ' + searchTerm);
  };

  const handleClick = (e) => {
    // Solo crear efectos cuando se hace clic en el fondo, no en los elementos hijo
    if (e.target === e.currentTarget) {
      const newEffect = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };

      setClickEffects(prev => [...prev, newEffect]);

      setTimeout(() => {
        setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 3000);
    }
  };

  return (
    <div className={styles.app} onClick={handleClick}>
      <Nav />
      
      <div className={styles.radarCircles}>
        <span></span>
      </div>
      <div className={styles.radarLines}></div>
      <div className={styles.earthquakePoints}>
        {[...Array(12)].map((_, i) => <span key={i}></span>)}
      </div>

      {clickEffects.map(effect => (
        <div
          key={effect.id}
          className={styles.clickEffect}
          style={{ left: `${effect.x}px`, top: `${effect.y}px` }}
        />
      ))}

      <div className={styles.container}>
        <h1>TECTONIX.IA</h1>
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