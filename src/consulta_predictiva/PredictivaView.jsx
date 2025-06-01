import React, { useState, useEffect } from 'react';
import styles from './predictiva.module.css';
import { 
  MapIcon, 
  ChartBarIcon, 
  ClockIcon, 
  LocationMarkerIcon,
  RefreshIcon,
  ExternalLinkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';

const PredictivaView = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [predictionData, setPredictionData] = useState(null);

  const departments = [
    'Lima',
    'Arequipa',
    'Cusco',
    'Piura',
    'La Libertad',
    'Lambayeque',
    'Junín',
    'Ancash',
    'Puno',
    'Tacna'
  ];

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // Aquí iría la llamada a la API para obtener los datos
      // Por ahora usamos datos de ejemplo
      const mockData = {
        zona: 'Costa Central',
        prediccion: {
          magnitud: 6.5,
          probabilidad: 0.75,
          tiempoEstimado: '48 horas'
        },
        probabilidades: {
          baja: 0.15,
          media: 0.35,
          alta: 0.50
        }
      };
      
      setPredictionData(mockData);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDepartment) {
      handleRefresh();
    }
  }, [selectedDepartment]);

  const getMagnitudColor = (magnitud) => {
    if (magnitud >= 7.0) return styles['prediccion-valor--rojo'];
    if (magnitud >= 6.0) return styles['prediccion-valor--amarillo'];
    return styles['prediccion-valor--verde'];
  };

  return (
    <div className={styles['app-container']}>
      <div className={styles['radar-effect']} />
      
      <nav className={styles['app-nav']}>
        <h2>Sistema de Predicción Sísmica</h2>
      </nav>

      <main className={styles['main-container']}>
        <h1 className={styles['main-title']}>Predicción de Actividad Sísmica</h1>

        <div className={styles['tabs-container']}>
          <button className={`${styles.tab} ${styles['active-tab']}`}>
            <MapIcon className={styles['tab-icon']} />
            Predicción
          </button>
          <button className={styles.tab}>
            <ChartBarIcon className={styles['tab-icon']} />
            Histórico
          </button>
        </div>

        <div className={styles['search-container']}>
          <select
            className={styles['department-select']}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Seleccione un departamento</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <button
            className={styles['refresh-button']}
            onClick={handleRefresh}
            disabled={loading || !selectedDepartment}
          >
            {loading ? (
              <RefreshIcon className={styles['refresh-icon']} />
            ) : (
              <RefreshIcon className={styles['refresh-icon']} />
            )}
            Actualizar
          </button>
        </div>

        {lastUpdate && (
          <div className={styles['last-update']}>
            Última actualización: {lastUpdate.toLocaleString()}
          </div>
        )}

        {error && (
          <div className={styles['error-message']}>
            <ExclamationCircleIcon className={styles['info-icon']} />
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles['loading-message']}>
            <div className={styles.spinner} />
            <p>Cargando datos...</p>
          </div>
        ) : predictionData ? (
          <div className={styles['result-container']}>
            <div className={styles['prediccion-container']}>
              <span className={styles['zona-badge']}>
                {predictionData.zona}
              </span>
              
              <h2 className={styles['prediccion-titulo']}>
                Predicción para los próximos días
              </h2>

              <div className={styles['prediccion-grid']}>
                <div className={styles['prediccion-card']}>
                  <span className={styles['prediccion-label']}>
                    Magnitud Estimada
                  </span>
                  <span className={`${styles['prediccion-valor']} ${getMagnitudColor(predictionData.prediccion.magnitud)}`}>
                    {predictionData.prediccion.magnitud}
                  </span>
                </div>

                <div className={styles['prediccion-card']}>
                  <span className={styles['prediccion-label']}>
                    Probabilidad
                  </span>
                  <span className={styles['prediccion-valor']}>
                    {(predictionData.prediccion.probabilidad * 100).toFixed(1)}%
                  </span>
                </div>

                <div className={styles['prediccion-card']}>
                  <span className={styles['prediccion-label']}>
                    Tiempo Estimado
                  </span>
                  <span className={styles['prediccion-valor']}>
                    {predictionData.prediccion.tiempoEstimado}
                  </span>
                </div>
              </div>

              <h3 className={styles['probabilidades-titulo']}>
                Distribución de Probabilidades
              </h3>

              <div className={styles['probabilidades-grid']}>
                <div className={styles['probabilidad-card']}>
                  <span className={styles['probabilidad-label']}>
                    Probabilidad Baja
                  </span>
                  <span className={styles['probabilidad-valor']}>
                    {(predictionData.probabilidades.baja * 100).toFixed(1)}%
                  </span>
                </div>

                <div className={styles['probabilidad-card']}>
                  <span className={styles['probabilidad-label']}>
                    Probabilidad Media
                  </span>
                  <span className={styles['probabilidad-valor']}>
                    {(predictionData.probabilidades.media * 100).toFixed(1)}%
                  </span>
                </div>

                <div className={styles['probabilidad-card']}>
                  <span className={styles['probabilidad-label']}>
                    Probabilidad Alta
                  </span>
                  <span className={styles['probabilidad-valor']}>
                    {(predictionData.probabilidades.alta * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles['empty-state']}>
            <h2>Seleccione un departamento</h2>
            <div className={styles.divider} />
            <p>Para ver las predicciones, seleccione un departamento de la lista</p>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          Datos proporcionados por el{' '}
          <a
            href="https://www.igp.gob.pe/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles['igp-link']}
          >
            Instituto Geofísico del Perú
            <ExternalLinkIcon className={styles['external-link-icon']} />
          </a>
        </p>
      </footer>
    </div>
  );
};

export default PredictivaView; 