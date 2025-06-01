import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Activity, RefreshCw, ExternalLink, TrendingUp, BarChart2, Shield, AlertCircle, Zap, Globe, Calendar } from 'lucide-react';
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
  const [showPrediction, setShowPrediction] = useState(false);

  const actualizarDatos = async () => {
    if (activeTab === 'reportados') {
      setLoading(true);
      setError('');
      try {
        const sismosData = await obtenerSismosIGP();
        let sismosFiltrados = sismosData;
        
        if (searchTerm) {
          sismosFiltrados = sismosData
            .filter(sismo => sismo.departamento === searchTerm)
            .sort((a, b) => {
              const fechaA = new Date(a.fechaLocal + ' ' + a.horaLocal);
              const fechaB = new Date(b.fechaLocal + ' ' + b.horaLocal);
              return fechaB - fechaA;
            })
            .slice(0, 3);
        } else {
          sismosFiltrados = sismosData
            .sort((a, b) => {
              const fechaA = new Date(a.fechaLocal + ' ' + a.horaLocal);
              const fechaB = new Date(b.fechaLocal + ' ' + b.horaLocal);
              return fechaB - fechaA;
            })
            .slice(0, 3);
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
        setShowPrediction(true);
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
    if (magnitud < 4.5) return { 
      backgroundColor: 'rgba(0, 255, 0, 0.15)', 
      color: '#00ff00',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)'
    };
    if (magnitud < 6.0) return { 
      backgroundColor: 'rgba(255, 215, 0, 0.15)', 
      color: '#ffd700',
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
    };
    return { 
      backgroundColor: 'rgba(255, 0, 0, 0.15)', 
      color: '#ff0000',
      boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)'
    };
  };

  const getRiskColor = (nivelRiesgo) => {
    switch(nivelRiesgo) {
      case 'BAJO': return { 
        color: '#00ff00', 
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)'
      };
      case 'MEDIO': return { 
        color: '#ffd700', 
        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
      };
      case 'ALTO': return { 
        color: '#ff0000', 
        textShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
        boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)'
      };
      default: return { 
        color: '#ffffff', 
        textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
      };
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
    <div className={styles['app-container']}>
      <div className={styles['main-container']}>
        <div className={styles['header-section']}>
          <h1 className={styles['main-title']}>
            {activeTab === 'reportados' ? 'SISMOS REPORTADOS' : 'PREDICCIÓN SÍSMICA'}
          </h1>
          <p className={styles['subtitle']}>
            {activeTab === 'reportados' 
              ? searchTerm 
                ? `Últimos 3 sismos en ${searchTerm}`
                : 'Últimos 3 sismos en Perú'
              : 'Análisis predictivo de riesgo sísmico'
            }
          </p>
        </div>

        <div className={styles['tabs-container']}>
          <button
            className={`${styles['tab']} ${activeTab === 'reportados' ? styles['active-tab'] : ''}`}
            onClick={() => {
              setActiveTab('reportados');
              setShowPrediction(false);
            }}
          >
            <Activity size={18} />
            <span>Sismos</span>
          </button>
          <button
            className={`${styles['tab']} ${activeTab === 'prediccion' ? styles['active-tab'] : ''}`}
            onClick={() => {
              setActiveTab('prediccion');
              setShowPrediction(false);
            }}
          >
            <TrendingUp size={18} />
            <span>Predicción</span>
          </button>
        </div>

        <div className={styles['search-container']}>
          <div className={styles['select-wrapper']}>
            <select
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowPrediction(false);
              }}
              className={styles['department-select']}
            >
              <option value="">
                {activeTab === 'reportados' ? 'Todos los departamentos' : 'Seleccione departamento'}
              </option>
              {Object.keys(departamentosPeru).sort().map((depto) => (
                <option key={depto} value={depto}>{depto}</option>
              ))}
            </select>
          </div>

          {activeTab === 'reportados' && (
            <div className={styles['select-wrapper']}>
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
            </div>
          )}

          <button
            onClick={actualizarDatos}
            disabled={loading || (activeTab === 'prediccion' && !searchTerm)}
            className={styles['refresh-button']}
          >
            <RefreshCw size={18} className={loading ? styles['spinning'] : ''} />
            <span>{loading ? 'Cargando...' : (activeTab === 'reportados' ? 'Actualizar' : 'Predecir')}</span>
          </button>
        </div>

        {lastUpdate && (
          <div className={styles['last-update']}>
            <Clock size={14} />
            <span>Última actualización: {formatearFecha(lastUpdate)}</span>
          </div>
        )}

        <div className={styles['result-container']}>
          {error && (
            <div className={styles['error-message']}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className={styles['loading-message']}>
              <div className={styles['spinner']}></div>
              <span>{activeTab === 'reportados' ? 'Obteniendo sismos...' : 'Calculando predicción...'}</span>
            </div>
          )}

          {activeTab === 'reportados' && !loading && sismosFiltrados.length > 0 && (
            <div className={styles['sismos-grid']}>
              {sismosFiltrados.map((sismo, index) => (
                <div key={sismo.id} className={styles['sismo-card']}>
                  <div className={styles['magnitud-badge']} style={obtenerColorMagnitud(sismo.magnitud)}>
                    <Zap size={18} />
                    <span>M {sismo.magnitud} - {sismo.intensidad}</span>
                  </div>
                  
                  <h3 className={styles['sismo-location']}>
                    <MapPin size={18} />
                    {sismo.ubicacion}
                  </h3>

                  <div className={styles['info-grid']}>
                    <div className={styles['info-item']}>
                      <Clock size={16} />
                      <span>{sismo.fechaLocal} {sismo.horaLocal}</span>
                    </div>
                    <div className={styles['info-item']}>
                      <MapPin size={16} />
                      <span>Prof: {sismo.profundidad} km</span>
                    </div>
                    <div className={styles['info-item']}>
                      <Globe size={16} />
                      <span>{sismo.latitud}° / {sismo.longitud}°</span>
                    </div>
                    <div className={styles['info-item']}>
                      <Shield size={16} />
                      <span>{sismo.estado}</span>
                    </div>
                  </div>

                  <div className={styles['sismo-footer']}>
                    <span className={styles['sismo-time']}>
                      Hace {Math.round((new Date() - new Date(sismo.fechaLocal + ' ' + sismo.horaLocal)) / 60000)} minutos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prediccion' && prediccion && !loading && showPrediction && (
            <div className={styles['prediccion-container']}>
              <div className={styles['prediccion-grid']}>
                <div className={styles['prediccion-card']}>
                  <BarChart2 size={18} />
                  <span className={styles['prediccion-label']}>Tendencia</span>
                  <span className={styles['prediccion-valor']} style={getRiskColor('MEDIO')}>ESTABLE</span>
                </div>
                <div className={styles['prediccion-card']}>
                  <AlertCircle size={18} />
                  <span className={styles['prediccion-label']}>Riesgo</span>
                  <span className={styles['prediccion-valor']} style={getRiskColor(prediccion.estadisticas.nivelRiesgo)}>
                    {prediccion.estadisticas.nivelRiesgo}
                  </span>
                </div>
                <div className={styles['prediccion-card']}>
                  <Activity size={18} />
                  <span className={styles['prediccion-label']}>Total Sismos</span>
                  <span className={styles['prediccion-valor']}>{prediccion.estadisticas.totalSismos}</span>
                </div>
                <div className={styles['prediccion-card']}>
                  <Clock size={18} />
                  <span className={styles['prediccion-label']}>Sismos/Día</span>
                  <span className={styles['prediccion-valor']}>{prediccion.estadisticas.sismosPorDia}</span>
                </div>
                <div className={styles['prediccion-card']}>
                  <Zap size={18} />
                  <span className={styles['prediccion-label']}>Mag. Promedio</span>
                  <span className={styles['prediccion-valor']}>{prediccion.estadisticas.magnitudPromedio}</span>
                </div>
              </div>

              <div className={styles['probabilidades-section']}>
                <div className={styles['probabilidades-grid']}>
                  <div className={styles['probabilidad-card']}>
                    <Clock size={18} />
                    <span className={styles['probabilidad-label']}>24 horas</span>
                    <span className={styles['probabilidad-valor']}>{prediccion.estadisticas.probabilidades.diaria}</span>
                  </div>
                  <div className={styles['probabilidad-card']}>
                    <Calendar size={18} />
                    <span className={styles['probabilidad-label']}>7 días</span>
                    <span className={styles['probabilidad-valor']}>{prediccion.estadisticas.probabilidades.semanal}</span>
                  </div>
                  <div className={styles['probabilidad-card']}>
                    <Calendar size={18} />
                    <span className={styles['probabilidad-label']}>30 días</span>
                    <span className={styles['probabilidad-valor']}>{prediccion.estadisticas.probabilidades.mensual}</span>
                  </div>
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
                    : 'MONITOREO SÍSMICO'
                  : 'ANÁLISIS PREDICTIVO'
                }
              </h2>
              <p>
                {activeTab === 'reportados'
                  ? searchTerm
                    ? 'No hay sismos reportados para este departamento'
                    : 'Seleccione un departamento para ver los últimos 3 sismos'
                  : 'Seleccione un departamento para obtener la predicción'
                }
              </p>
            </div>
          )}
        </div>

        <div className={styles['footer']}>
          <p>Datos proporcionados por el IGP</p>
          <a 
            href="https://ultimosismo.igp.gob.pe/ultimo-sismo/sismos-reportados" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles['igp-link']}
          >
            <ExternalLink size={14} />
            <span>Página oficial del IGP</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Predictiva;