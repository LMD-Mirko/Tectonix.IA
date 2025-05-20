import React, { useState } from 'react';
import styles from './predictiva.module.css';

function Predictiva() {
  const [searchTerm, setSearchTerm] = useState('');
  const [predictedSymptom, setPredictedSymptom] = useState('');

  const handleSearch = () => {
    // Lógica para buscar por ubicación
    console.log('Buscando en ubicación:', searchTerm);
  };

  const handlePredict = () => {
    // Lógica para predecir posibles sismos
    setPredictedSymptom('RIESGO DE SISMO EN: ' + searchTerm);
  };

  return (
    <div className={styles.app}>
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