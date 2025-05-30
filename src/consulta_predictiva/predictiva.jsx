import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Activity, RefreshCw, ExternalLink, TrendingUp } from 'lucide-react';
import styles from './predictiva.module.css';
import { obtenerSismosIGP, obtenerPrediccionDepartamento, departamentosPeru } from './predictiveAnalysis';

const Predictiva = () => {
  const [activeTab, setActiveTab] = useState('reportados');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediccion, setPrediccion] = useState(null);
  const [sismos, setSismos] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filtroMagnitud, setFiltroMagnitud] = useState('todos');

  const actualizarDatos = async () => {
    if (activeTab === 'reportados') {
      setLoading(true);
      setError('');
      try {
        const sismosData = await obtenerSismosIGP();
        let sismosFiltrados = sismosData;
        
        if (searchTerm) {
          sismosFiltrados = sismosData.filter(sismo => 
            sismo.departamento === searchTerm
          );
        }
        
        setSismos(sismosFiltrados);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error:', err);
        setError('Error al obtener datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'prediccion' && searchTerm) {
      setLoading(true);
      setError('');
      try {
        const resultado = await obtenerPrediccionDepartamento(searchTerm);
        setPrediccion(resultado);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error:', err);
        setError('Error al obtener predicción: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    actualizarDatos();
  }, [searchTerm, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      actualizarDatos();
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [activeTab, searchTerm]);

  const obtenerColorMagnitud = (magnitud) => {
    if (magnitud < 4.5) return { backgroundColor: '#22c55e', color: '#ffffff' };
    if (magnitud < 6.0) return { backgroundColor: '#f59e0b', color: '#ffffff' };
    return { backgroundColor: '#ef4444', color: '#ffffff' };
  };

  const getRiskColor = (nivelRiesgo) => {
    switch(nivelRiesgo) {
      case 'BAJO': return styles['prediccion-valor--verde'];
      case 'MEDIO': return styles['prediccion-valor--amarillo'];
      case 'ALTO': return styles['prediccion-valor--rojo'];
      default: return '';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return fecha.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const sismosFiltrados = sismos.filter(sismo => {
    if (filtroMagnitud === 'todos') return true;
    if (filtroMagnitud === 'menor') return sismo.magnitud < 4.5;
    if (filtroMagnitud === 'moderado') return sismo.magnitud >= 4.5 && sismo.magnitud < 6.0;
    if (filtroMagnitud === 'fuerte') return sismo.magnitud >= 6.0;
    return true;
  });

  return (
    <div className={styles['app-container']} style={{ minHeight: '100vh', paddingTop: '1.5rem' }}>
      <div className="radar-effect" style={{ animationDelay: '0s' }}></div>
      <div className="radar-effect" style={{ top: '60%', left: '5%', width: '300px', height: '300px', animationDelay: '1s' }}></div>
      
      <nav className={styles['app-nav']}>
        <h2>TECTONIX.IA</h2>
      </nav>

      <div className={styles['main-container']}>
        <h1 className={styles['main-title']}>
          {activeTab === 'reportados' ? 'SISMOS REPORTADOS' : 'PREDICCIÓN SÍSMICA'}
        </h1>

        <div className={styles['tabs-container']}>
          <button
            className={`${styles['tab']} ${activeTab === 'reportados' ? styles['active-tab'] : ''}`}
            onClick={() => setActiveTab('reportados')}
          >
            <Activity className={styles['tab-icon']} />
            Sismos Reportados
          </button>
          <button
            className={`${styles['tab']} ${activeTab === 'prediccion' ? styles['active-tab'] : ''}`}
            onClick={() => setActiveTab('prediccion')}
          >
            <TrendingUp className={styles['tab-icon']} />
            Predicción Sísmica
          </button>
        </div>

        <div className={styles['search-container']}>
          <select
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles['department-select']}
          >
            <option value="">
              {activeTab === 'reportados' ? 'Todos los departamentos' : 'Seleccione un departamento'}
            </option>
            {Object.keys(departamentosPeru).sort().map((depto) => (
              <option key={depto} value={depto}>
                {depto}
              </option>
            ))}
          </select>

          {activeTab === 'reportados' && (
            <select
              value={filtroMagnitud}
              onChange={(e) => setFiltroMagnitud(e.target.value)}
              className={styles['department-select']}
            >
              <option value="todos">Todas las magnitudes</option>
              <option value="menor">🟢 Menor (&lt; 4.5)</option>
              <option value="moderado">🟠 Moderado (4.5 - 5.9)</option>
              <option value="fuerte">🔴 Fuerte (≥ 6.0)</option>
            </select>
          )}

          <button
            onClick={actualizarDatos}
            disabled={loading || (activeTab === 'prediccion' && !searchTerm)}
            className={styles['refresh-button']}
          >
            <RefreshCw className={styles['refresh-icon']} />
            {loading ? 'Cargando...' : (activeTab === 'reportados' ? 'Actualizar' : 'Predecir Sismo')}
          </button>
        </div>

        {lastUpdate && (
          <div className={styles['last-update']}>
            Última actualización: {formatearFecha(lastUpdate)}
          </div>
        )}

        <div className={styles['result-container']}>
          {error && (
            <div className={styles['error-message']}>
              <AlertTriangle />
              {error}
            </div>
          )}

          {loading && (
            <div className={styles['loading-message']}>
              <div className={styles['spinner']}></div>
              {activeTab === 'reportados' ? 'Obteniendo sismos del IGP...' : 'Calculando predicción...'}
            </div>
          )}

          {activeTab === 'reportados' && !loading && sismosFiltrados.length > 0 && (
            <div>
              <h2 className={styles['section-title']}>
                {searchTerm ? `Sismos en ${searchTerm}` : 'Todos los Sismos Reportados'} ({sismosFiltrados.length})
              </h2>
              {sismosFiltrados.map((sismo) => (
                <div
                  key={sismo.id}
                  className={styles['sismo-card']}
                >
                  <div className={styles['magnitud-badge']} style={obtenerColorMagnitud(sismo.magnitud)}>
                    M {sismo.magnitud} - {sismo.intensidad}
                  </div>
                  
                  <h3 className={styles['sismo-location']}>
                    <MapPin className={styles['location-icon']} />
                    {sismo.ubicacion}
                  </h3>

                  <div className={styles['info-grid']}>
                    <div className={styles['info-item']}>
                      <Clock className={styles['info-icon']} />
                      {sismo.fechaLocal} {sismo.horaLocal}
                    </div>
                    <div className={styles['info-item']}>
                      <span>📍 Profundidad: {sismo.profundidad} km</span>
                    </div>
                    <div className={styles['info-item']}>
                      <span>🌍 Lat: {sismo.latitud}° / Long: {sismo.longitud}°</span>
                    </div>
                    <div className={styles['info-item']}>
                      <span>📊 Estado: {sismo.estado}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prediccion' && prediccion && !loading && (
            <div className={styles['prediccion-container']}>
              <div className={styles['zona-badge']}>Zona: CENTRO</div>
              <h2 className={styles['prediccion-titulo']}>Predicción para {prediccion.departamento}</h2>
              <div className={styles['prediccion-grid']}>
                <div className={styles['prediccion-card']}>
                  <span className={styles['prediccion-label']}>Tendencia Actual</span>
                  <span className={`${styles['prediccion-valor']} ${styles['prediccion-valor--amarillo']}`}>ESTABLE</span>
                </div>
                <div className={styles['prediccion-card']}>
                  <span className={styles['prediccion-label']}>Nivel de Actividad</span>
                  <span className={`${styles['prediccion-valor']} ${getRiskColor(prediccion.estadisticas.nivelRiesgo)}`}>{prediccion.estadisticas.nivelRiesgo}</span>
                </div>
                <div className={styles['prediccion-card']}>
                  <span className={styles['prediccion-label']}>Total de Sismos (90 días)</span>
                  <span className={styles['prediccion-valor']}>{prediccion.estadisticas.totalSismos}</span>
                </div>
                <div className={styles['prediccion-card']}>
                  <span className={styles['prediccion-label']}>Sismos por Día</span>
                  <span className={styles['prediccion-valor']}>{prediccion.estadisticas.sismosPorDia}</span>
                </div>
                <div className={styles['prediccion-card']}>
                  <span className={styles['prediccion-label']}>Magnitud Promedio</span>
                  <span className={styles['prediccion-valor']}>{prediccion.estadisticas.magnitudPromedio}</span>
                </div>
              </div>
              <div className={styles['probabilidades-titulo']}>Probabilidades de Sismo</div>
              <div className={styles['probabilidades-grid']}>
                <div className={styles['probabilidad-card']}>
                  <span className={styles['probabilidad-label']}>Probabilidad 24 horas</span>
                  <span className={styles['probabilidad-valor']}>{prediccion.estadisticas.probabilidades.diaria}</span>
                </div>
                <div className={styles['probabilidad-card']}>
                  <span className={styles['probabilidad-label']}>Probabilidad 7 días</span>
                  <span className={styles['probabilidad-valor']}>{prediccion.estadisticas.probabilidades.semanal}</span>
                </div>
                <div className={styles['probabilidad-card']}>
                  <span className={styles['probabilidad-label']}>Probabilidad 30 días</span>
                  <span className={styles['probabilidad-valor']}>{prediccion.estadisticas.probabilidades.mensual}</span>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && sismosFiltrados.length === 0 && !prediccion && (
            <div className={styles['empty-state']}>
              <h2>
                {activeTab === 'reportados' 
                  ? searchTerm 
                    ? `No se encontraron sismos en ${searchTerm}`
                    : 'MONITOREO SÍSMICO EN TIEMPO REAL'
                  : 'ANÁLISIS PREDICTIVO DE RIESGO SÍSMICO'
                }
              </h2>
              <div className={styles['divider']}></div>
              <p>
                {activeTab === 'reportados'
                  ? searchTerm
                    ? 'No hay sismos reportados para este departamento en el período actual'
                    : 'Seleccione un departamento para filtrar sismos o vea todos los reportes recientes'
                  : 'Seleccione un departamento para obtener la predicción de riesgo sísmico'
                }
              </p>
            </div>
          )}
        </div>

        <div className="footer">
          <p>
            Datos sísmicos proporcionados por el Instituto Geofísico del Perú (IGP)
          </p>
          <p>
            <ExternalLink className="external-link-icon" />
            <a 
              href="https://ultimosismo.igp.gob.pe/ultimo-sismo/sismos-reportados" 
              target="_blank" 
              rel="noopener noreferrer"
              className="igp-link"
            >
              Página oficial del IGP
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Predictiva;