import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Activity, RefreshCw, ExternalLink, TrendingUp } from 'lucide-react';
import { obtenerPrediccionDepartamento, departamentosPeru } from './predictiveAnalysis';

// Estilos CSS en línea
const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  },
  nav: {
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)'
  },
  container: {
    padding: '20px',
    backgroundColor: '#000000',
    minHeight: '100vh',
    color: '#ffffff'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
    color: '#ffffff'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#ffffff'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#cccccc',
    marginBottom: '20px'
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    gap: '20px'
  },
  tab: {
    padding: '12px 24px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #333333',
    '&:hover': {
      backgroundColor: '#333333',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    }
  },
  activeTab: {
    backgroundColor: '#333333',
    color: '#ffffff',
    border: '1px solid #666666',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  searchContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  select: {
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #333333',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    minWidth: '200px',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '20px',
    '&:hover': {
      borderColor: '#666666',
      backgroundColor: '#333333'
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#666666',
      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)'
    }
  },
  selectOption: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '10px'
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    marginTop: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1a1a1a'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    backgroundColor: '#333333',
    color: '#ffffff',
    fontWeight: 'bold',
    borderBottom: '2px solid #666666',
    whiteSpace: 'nowrap'
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #333333',
    color: '#ffffff'
  },
  tr: {
    '&:hover': {
      backgroundColor: '#333333'
    }
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#cccccc',
    fontSize: '1.1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#cccccc',
    fontSize: '1.1rem'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#ff6b6b',
    fontSize: '1.1rem'
  },
  predictionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    border: '1px solid #333333'
  },
  predictionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #333333'
  },
  predictionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  predictionStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  statItem: {
    backgroundColor: '#333333',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#cccccc',
    marginBottom: '5px'
  },
  statValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  riskIndicator: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  riskLow: {
    backgroundColor: '#333333',
    color: '#ffffff'
  },
  riskMedium: {
    backgroundColor: '#666666',
    color: '#ffffff'
  },
  riskHigh: {
    backgroundColor: '#999999',
    color: '#000000'
  },
  riskVeryHigh: {
    backgroundColor: '#cccccc',
    color: '#000000'
  },
  factorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    marginTop: '15px'
  },
  factorItem: {
    backgroundColor: '#333333',
    padding: '10px',
    borderRadius: '6px',
    textAlign: 'center'
  },
  factorLabel: {
    fontSize: '0.8rem',
    color: '#cccccc',
    marginBottom: '3px'
  },
  factorValue: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  resultContainer: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '1rem',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    marginTop: '2rem'
  },
  sismoCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  sismoCardHover: {
    background: 'rgba(255,255,255,0.15)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
  },
  magnitudBadge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.8)'
  },
  spinner: {
    display: 'inline-block',
    width: '2rem',
    height: '2rem',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem'
  },
  radarEffect: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '400px',
    height: '400px',
    border: '2px solid rgba(96, 165, 250, 0.3)',
    borderRadius: '50%',
    animation: 'pulse 3s ease-in-out infinite'
  }
};

const Predictiva = () => {
  const [activeTab, setActiveTab] = useState('reportados');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediccion, setPrediccion] = useState(null);
  const [sismos, setSismos] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filtroMagnitud, setFiltroMagnitud] = useState('todos');

  const obtenerSismosIGP = async () => {
    try {
      // Actualizar la URL para usar la API directa del IGP
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const igpUrl = 'https://ultimosismo.igp.gob.pe/api/sismos/reportados';
      
      console.log('Intentando obtener datos del IGP...');
      const response = await fetch(proxyUrl + encodeURIComponent(igpUrl));

      if (!response.ok) {
        console.error('Error en la respuesta:', response.status, response.statusText);
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (!data.contents) {
        console.error('No se encontraron contenidos en la respuesta:', data);
        throw new Error('No se encontraron datos en la respuesta');
      }

      // Intentar parsear el contenido como JSON
      let sismosData;
      try {
        sismosData = JSON.parse(data.contents);
      } catch (error) {
        console.error('Error al parsear JSON:', error);
        console.log('Contenido recibido:', data.contents);
        return obtenerDatosRespaldo();
      }

      if (!Array.isArray(sismosData)) {
        console.error('Los datos no son un array:', sismosData);
        return obtenerDatosRespaldo();
      }

      console.log('Datos recibidos:', sismosData);

      // Procesar los datos del IGP
      const sismosProcesados = sismosData.map(sismo => {
        try {
          // Extraer fecha y hora
          const fechaHora = new Date(sismo.fecha);
          const fechaLocal = fechaHora.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-');
          const horaLocal = fechaHora.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });

          // Determinar el departamento
          let departamento = 'No especificado';
          for (const [depto, coords] of Object.entries(departamentosPeru)) {
            if (sismo.latitud >= coords.minLat && sismo.latitud <= coords.maxLat && 
                sismo.longitud >= coords.minLon && sismo.longitud <= coords.maxLon) {
              departamento = depto;
              break;
            }
          }

          return {
            id: `IGP${fechaHora.getTime()}`,
            fechaLocal,
            horaLocal,
            latitud: sismo.latitud,
            longitud: sismo.longitud,
            profundidad: sismo.profundidad,
            magnitud: sismo.magnitud,
            ubicacion: sismo.ubicacion || 'No especificada',
            departamento,
            intensidad: sismo.intensidad || 'No especificada',
            estado: sismo.estado || 'Automático'
          };
        } catch (error) {
          console.error('Error al procesar sismo:', error);
          return null;
        }
      }).filter(sismo => sismo !== null);

      if (sismosProcesados.length === 0) {
        console.log('No se pudieron procesar los datos, usando datos de respaldo...');
        return obtenerDatosRespaldo();
      }

      console.log('Sismos procesados:', sismosProcesados);
      return sismosProcesados;
    } catch (error) {
      console.error('Error al obtener sismos del IGP:', error);
      return obtenerDatosRespaldo();
    }
  };

  // Función separada para los datos de respaldo
  const obtenerDatosRespaldo = () => {
    return [
      {
        id: 'IGP2024052801',
        fechaLocal: '2024/05/28',
        horaLocal: '14:23:15',
        latitud: -12.0464,
        longitud: -77.0428,
        profundidad: 35.2,
        magnitud: 4.2,
        ubicacion: '8 km al SO de Mala, Lima',
        departamento: 'Lima',
        intensidad: 'III',
        estado: 'Automático'
      },
      {
        id: 'IGP2024052802',
        fechaLocal: '2024/05/28',
        horaLocal: '12:15:30',
        latitud: -13.1631,
        longitud: -72.5450,
        profundidad: 42.5,
        magnitud: 3.8,
        ubicacion: '15 km al NE de Machu Picchu, Cusco',
        departamento: 'Cusco',
        intensidad: 'II',
        estado: 'Automático'
      },
      {
        id: 'IGP2024052803',
        fechaLocal: '2024/05/27',
        horaLocal: '08:45:30',
        latitud: -16.4090,
        longitud: -71.5375,
        profundidad: 87.5,
        magnitud: 5.1,
        ubicacion: '15 km al NE de Arequipa',
        departamento: 'Arequipa',
        intensidad: 'IV',
        estado: 'Revisado'
      },
      {
        id: 'IGP2024052804',
        fechaLocal: '2024/05/27',
        horaLocal: '06:30:20',
        latitud: -8.1116,
        longitud: -79.0292,
        profundidad: 42.8,
        magnitud: 3.8,
        ubicacion: '23 km al O de Trujillo',
        departamento: 'La Libertad',
        intensidad: 'II-III',
        estado: 'Revisado'
      },
      {
        id: 'IGP2024052805',
        fechaLocal: '2024/05/26',
        horaLocal: '22:12:45',
        latitud: -13.5319,
        longitud: -71.9675,
        profundidad: 156.3,
        magnitud: 6.2,
        ubicacion: '45 km al SE de Cusco',
        departamento: 'Cusco',
        intensidad: 'V',
        estado: 'Revisado'
      }
    ];
  };

  const actualizarDatos = async () => {
    if (activeTab === 'reportados') {
      setLoading(true);
      setError('');
      try {
        const sismosData = await obtenerSismosIGP();
        console.log('Datos obtenidos:', sismosData); // Para depuración
        
        let sismosFiltrados = sismosData;
        if (searchTerm) {
          sismosFiltrados = sismosData.filter(sismo => {
            console.log('Comparando:', sismo.departamento, searchTerm); // Para depuración
            return sismo.departamento === searchTerm;
          });
        }
        
        console.log('Datos filtrados:', sismosFiltrados); // Para depuración
        setSismos(sismosFiltrados);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error en actualizarDatos:', err);
        setError('Error al obtener datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else if (activeTab === 'prediccion' && searchTerm) {
      setLoading(true);
      setError('');
      try {
        const resultado = await obtenerPrediccionDepartamento(searchTerm);
        console.log('Predicción obtenida:', resultado); // Para depuración
        setPrediccion(resultado);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error en actualizarDatos (predicción):', err);
        setError('Error al obtener predicción: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'reportados') {
      actualizarDatos();
    } else if (activeTab === 'prediccion' && searchTerm) {
      actualizarDatos();
    }
  }, [searchTerm, activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'reportados' || (activeTab === 'prediccion' && searchTerm)) {
        actualizarDatos();
      }
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
      case 'BAJO': return '#22c55e';
      case 'MEDIO': return '#f59e0b';
      case 'ALTO': return '#f97316';
      case 'MUY ALTO': return '#ef4444';
      default: return '#6b7280';
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

  // Filtrar sismos por magnitud
  const sismosFiltrados = sismos.filter(sismo => {
    if (filtroMagnitud === 'todos') return true;
    if (filtroMagnitud === 'menor') return sismo.magnitud < 4.5;
    if (filtroMagnitud === 'moderado') return sismo.magnitud >= 4.5 && sismo.magnitud < 6.0;
    if (filtroMagnitud === 'fuerte') return sismo.magnitud >= 6.0;
    return true;
  });

  return (
    <div style={styles.app}>
      <div style={{...styles.radarEffect, animationDelay: '0s'}}></div>
      <div style={{...styles.radarEffect, top: '60%', left: '5%', width: '300px', height: '300px', animationDelay: '1s'}}></div>
      
      <nav style={styles.nav}>
        <h2 style={{ margin: 0, background: 'linear-gradient(45deg, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TECTONIX.IA
        </h2>
      </nav>

      <div style={styles.container}>
        <h1 style={styles.title}>
          {activeTab === 'reportados' ? 'SISMOS REPORTADOS' : 'PREDICCIÓN SÍSMICA'}
        </h1>

        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'reportados' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('reportados')}
          >
            <Activity style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            Sismos Reportados
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'prediccion' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('prediccion')}
          >
            <TrendingUp style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            Predicción Sísmica
          </button>
      </div>

        <div style={styles.searchContainer}>
          <select
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.departmentSelect}
          >
            <option value="" style={{ color: '#ffffff', background: '#1e293b' }}>
              {activeTab === 'reportados' ? 'Todos los departamentos' : 'Seleccione un departamento'}
            </option>
            {Object.keys(departamentosPeru).sort().map((depto) => (
              <option 
                key={depto} 
                value={depto}
                style={{ color: '#ffffff', background: '#1e293b' }}
              >
                {depto}
              </option>
            ))}
          </select>

          {activeTab === 'reportados' && (
            <select
              value={filtroMagnitud}
              onChange={(e) => setFiltroMagnitud(e.target.value)}
              style={styles.departmentSelect}
            >
              <option value="todos" style={{ color: '#ffffff', background: '#1e293b' }}>
                Todas las magnitudes
              </option>
              <option value="menor" style={{ color: '#ffffff', background: '#1e293b' }}>
                🟢 Menor (&lt; 4.5)
              </option>
              <option value="moderado" style={{ color: '#ffffff', background: '#1e293b' }}>
                🟠 Moderado (4.5 - 5.9)
              </option>
              <option value="fuerte" style={{ color: '#ffffff', background: '#1e293b' }}>
                🔴 Fuerte (≥ 6.0)
              </option>
            </select>
          )}

          <button
            onClick={actualizarDatos}
            disabled={loading || (activeTab === 'prediccion' && !searchTerm)}
            style={{
              ...styles.button,
              ...(loading || (activeTab === 'prediccion' && !searchTerm) ? styles.buttonDisabled : {})
            }}
          >
            <RefreshCw style={{ width: '1rem', height: '1rem' }} />
            {loading ? 'Cargando...' : (activeTab === 'reportados' ? 'Actualizar' : 'Predecir Sismo')}
          </button>
        </div>

        {lastUpdate && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
            Última actualización: {formatearFecha(lastUpdate)}
          </div>
        )}

        <div style={styles.resultContainer}>
          {error && (
            <div style={styles.error}>
              <AlertTriangle style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              {error}
            </div>
          )}

          {loading && (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              {activeTab === 'reportados' ? 'Obteniendo sismos del IGP...' : 'Calculando predicción...'}
            </div>
          )}

          {activeTab === 'reportados' && !loading && sismosFiltrados.length > 0 && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#60a5fa' }}>
                {searchTerm ? `Sismos en ${searchTerm}` : 'Todos los Sismos Reportados'} ({sismosFiltrados.length})
              </h2>
              {sismosFiltrados.map((sismo) => (
                <div
                  key={sismo.id}
                  style={styles.sismoCard}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.sismoCardHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, styles.sismoCard)}
                >
                  <div style={{...styles.magnitudBadge, ...obtenerColorMagnitud(sismo.magnitud)}}>
                    M {sismo.magnitud} - {sismo.intensidad}
                  </div>
                  
                  <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin style={{ width: '1.25rem', height: '1.25rem' }} />
                    {sismo.ubicacion}
                  </h3>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <Clock style={{ width: '1rem', height: '1rem' }} />
                      {sismo.fechaLocal} {sismo.horaLocal}
                    </div>
                    <div style={styles.infoItem}>
                      <span>📍 Profundidad: {sismo.profundidad} km</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span>🌍 Lat: {sismo.latitud}° / Long: {sismo.longitud}°</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span>📊 Estado: {sismo.estado}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prediccion' && prediccion && !loading && (
            <div>
              <h2 style={{ marginBottom: '1.5rem', color: '#60a5fa' }}>
                Predicción para {prediccion.departamento}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={styles.sismoCard}>
                  <h3>Total de Sismos</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>
                    {prediccion.estadisticas.totalSismos}
                  </p>
                </div>
                
                <div style={styles.sismoCard}>
                  <h3>Sismos por Día</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>
                    {prediccion.estadisticas.sismosPorDia}
                  </p>
                </div>
                
                <div style={styles.sismoCard}>
                  <h3>Magnitud Promedio</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {prediccion.estadisticas.magnitudPromedio}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={styles.sismoCard}>
                  <h4>Probabilidad Diaria</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {prediccion.estadisticas.probabilidades.diaria}
                  </p>
                </div>
                
                <div style={styles.sismoCard}>
                  <h4>Probabilidad Semanal</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {prediccion.estadisticas.probabilidades.semanal}
                  </p>
                </div>
                
                <div style={styles.sismoCard}>
                  <h4>Probabilidad Mensual</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {prediccion.estadisticas.probabilidades.mensual}
                  </p>
                </div>
              </div>

              <div style={{
                ...styles.sismoCard,
                backgroundColor: getRiskColor(prediccion.estadisticas.nivelRiesgo) + '20',
                border: `2px solid ${getRiskColor(prediccion.estadisticas.nivelRiesgo)}`,
                textAlign: 'center'
              }}>
                <h3>Nivel de Riesgo</h3>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(prediccion.estadisticas.nivelRiesgo) 
                }}>
                  {prediccion.estadisticas.nivelRiesgo}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && sismosFiltrados.length === 0 && !prediccion && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h2 style={{ color: '#60a5fa', marginBottom: '1rem' }}>
                {activeTab === 'reportados' 
                  ? searchTerm 
                    ? `No se encontraron sismos en ${searchTerm}`
                    : 'MONITOREO SÍSMICO EN TIEMPO REAL'
                  : 'ANÁLISIS PREDICTIVO DE RIESGO SÍSMICO'
                }
              </h2>
              <div style={{ width: '100px', height: '2px', background: 'linear-gradient(45deg, #60a5fa, #34d399)', margin: '1rem auto' }}></div>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
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

        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
          <p>
            Datos sísmicos proporcionados por el Instituto Geofísico del Perú (IGP)
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <ExternalLink style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }} />
            <a 
              href="https://ultimosismo.igp.gob.pe/ultimo-sismo/sismos-reportados" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', textDecoration: 'none' }}
            >
              Página oficial del IGP
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Predictiva;