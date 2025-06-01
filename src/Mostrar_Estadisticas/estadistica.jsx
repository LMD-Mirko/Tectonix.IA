import React, { useState, useEffect } from "react";
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { obtenerSismos, departamentosPeru } from "./apiUSGS";
import styles from "./estadistica.module.css";
import EmailForm from "./EmailForm/EmailForm";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

function Estadistica() {
  const [sismos, setSismos] = useState([]);
  const [filtros, setFiltros] = useState({
    starttime: '2024-01-01',
    endtime: new Date().toISOString().split('T')[0],
    minMagnitude: 0,
    maxMagnitude: 10,
    departamento: ""
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormularioEmail, setMostrarFormularioEmail] = useState(false);

  useEffect(() => {
    cargarSismos();
  }, [filtros]);

  const cargarSismos = async () => {
    try {
      const datos = await obtenerSismos(filtros);
      setSismos(datos);
    } catch (error) {
      console.error("Error al cargar sismos:", error);
      setError("Error al cargar sismos");
    } finally {
      setCargando(false);
    }
  };

  const procesarDatosPorMes = () => {
    const meses = {};
    sismos.forEach(sismo => {
      const fecha = new Date(sismo.properties.time);
      const mes = fecha.toLocaleString('es-ES', { month: 'short' });
      meses[mes] = (meses[mes] || 0) + 1;
    });
    return meses;
  };

  const procesarDatosPorRegion = () => {
    const regiones = {
      "Costa": 0,
      "Sierra": 0,
      "Selva": 0
    };
    sismos.forEach(sismo => {
      const lat = sismo.geometry.coordinates[1];
      const lon = sismo.geometry.coordinates[0];
      
      if (lat < -8) {
        if (lon < -75) regiones["Costa"]++;
        else regiones["Sierra"]++;
      } else if (lat < -4) {
        if (lon < -78) regiones["Costa"]++;
        else if (lon < -74) regiones["Sierra"]++;
        else regiones["Selva"]++;
      } else {
        if (lon < -80) regiones["Costa"]++;
        else if (lon < -76) regiones["Sierra"]++;
        else regiones["Selva"]++;
      }
    });
    return regiones;
  };

  const procesarDatosPorIntensidad = () => {
    const intensidades = {
      "Leve (M < 4.0)": 0,
      "Moderado (4.0 - 5.9)": 0,
      "Fuerte (6.0 - 6.9)": 0,
      "Severo (M ≥ 7.0)": 0
    };
    sismos.forEach(sismo => {
      const magnitud = sismo.properties.mag;
      if (magnitud < 4.0) intensidades["Leve (M < 4.0)"]++;
      else if (magnitud < 6.0) intensidades["Moderado (4.0 - 5.9)"]++;
      else if (magnitud < 7.0) intensidades["Fuerte (6.0 - 6.9)"]++;
      else intensidades["Severo (M ≥ 7.0)"]++;
    });
    return intensidades;
  };

  const procesarDatosPorProfundidad = () => {
    const profundidades = {
      "Superficial (< 30 km)": 0,
      "Intermedio (30 - 100 km)": 0,
      "Profundo (> 100 km)": 0
    };
    sismos.forEach(sismo => {
      const profundidad = sismo.geometry.coordinates[2];
      if (profundidad < 30) profundidades["Superficial (< 30 km)"]++;
      else if (profundidad < 100) profundidades["Intermedio (30 - 100 km)"]++;
      else profundidades["Profundo (> 100 km)"]++;
    });
    return profundidades;
  };

  const manejarCambioFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      starttime: '2024-01-01',
      endtime: new Date().toISOString().split('T')[0],
      minMagnitude: 0,
      maxMagnitude: 10,
      departamento: ""
    });
  };

  // Prepare chart data procesar los datos para los gráficos
  const datosPorMes = procesarDatosPorMes();
  const datosPorRegion = procesarDatosPorRegion();
  const datosPorIntensidad = procesarDatosPorIntensidad();
  const datosPorProfundidad = procesarDatosPorProfundidad();

  const lineChartData = {
    labels: Object.keys(datosPorMes),
    datasets: [{
      label: "Sismos por Mes en Perú",
      data: Object.values(datosPorMes),
      borderColor: "#E63946",
      backgroundColor: "rgba(230, 57, 70, 0.1)",
      tension: 0.4,
      pointBackgroundColor: "#E63946",
      pointBorderColor: "#ffffff",
      pointHoverBackgroundColor: "#ffffff",
      pointHoverBorderColor: "#E63946"
    }],
  };

const barChartData = {
  labels: Object.keys(datosPorRegion),
  datasets: [{
    label: "Sismos por Región en Perú",
    data: Object.values(datosPorRegion),
    backgroundColor: [
      "rgba(230, 57, 70, 0.7)",    // Rojo mate para Costa
      "rgba(255, 183, 77, 0.7)",   // Amarillo mate para Sierra
      "rgba(72, 187, 120, 0.7)",   // Verde mate para Selva
    ],
    borderColor: [
      "rgba(230, 57, 70, 1)",
      "rgba(255, 183, 77, 1)",
      "rgba(72, 187, 120, 1)",
    ],
    borderWidth: 1
  }],
};

const pieChartData = {
  labels: Object.keys(datosPorIntensidad),
  datasets: [{
    data: Object.values(datosPorIntensidad),
    backgroundColor: [
      "rgba(72, 187, 120, 0.7)",   // Verde mate para Leve
      "rgba(255, 183, 77, 0.7)",   // Amarillo mate para Moderado
      "rgba(230, 57, 70, 0.7)",    // Rojo mate para Fuerte
      "rgba(45, 55, 72, 0.7)",     // Negro mate para Severo
    ],
    borderColor: [
      "rgba(72, 187, 120, 1)",
      "rgba(255, 183, 77, 1)",
      "rgba(230, 57, 70, 1)",
      "rgba(45, 55, 72, 1)",
    ],
    borderWidth: 1
  }],
};

const doughnutChartData = {
  labels: Object.keys(datosPorProfundidad),
  datasets: [{
    data: Object.values(datosPorProfundidad),
    backgroundColor: [
      "rgba(72, 187, 120, 0.7)",   // Verde mate para Superficial
      "rgba(255, 183, 77, 0.7)",   // Amarillo mate para Intermedio
      "rgba(45, 55, 72, 0.7)",     // Negro mate para Profundo
    ],
    borderColor: [
      "rgba(72, 187, 120, 1)",
      "rgba(255, 183, 77, 1)",
      "rgba(45, 55, 72, 1)",
    ],
    borderWidth: 1
  }],
};
  const radarChartData = {
    labels: ["Magnitud Promedio", "Profundidad Promedio", "Total Sismos", "Intensidad Promedio", "Frecuencia"],
    datasets: [{
      label: "Características de Sismos en Perú",
      data: [
        sismos.reduce((acc, sismo) => acc + sismo.properties.mag, 0) / sismos.length,
        sismos.reduce((acc, sismo) => acc + sismo.geometry.coordinates[2], 0) / sismos.length,
        sismos.length,
        sismos.reduce((acc, sismo) => acc + sismo.properties.mag, 0) / sismos.length,
        sismos.length
      ],
      backgroundColor: "rgba(230, 57, 70, 0.2)",
      borderColor: "#E63946",
      borderWidth: 2,
      pointBackgroundColor: "#E63946",
      pointBorderColor: "#ffffff",
      pointHoverBackgroundColor: "#ffffff",
      pointHoverBorderColor: "#E63946"
    }],
  };

  const polarAreaData = {
    labels: Object.keys(datosPorRegion),
    datasets: [{
      label: "Distribución Sísmica en Perú",
      data: Object.values(datosPorRegion),
      backgroundColor: [
        "rgba(230, 57, 70, 0.7)",    // Rojo mate para Costa
        "rgba(255, 183, 77, 0.7)",   // Amarillo mate para Sierra
        "rgba(72, 187, 120, 0.7)",   // Verde mate para Selva
      ],
      borderColor: [
        "rgba(230, 57, 70, 1)",
        "rgba(255, 183, 77, 1)",
        "rgba(72, 187, 120, 1)",
      ],
      borderWidth: 1
    }],
  };

  const chartConfigs = {
    lineChartData,
    barChartData,
    pieChartData,
    doughnutChartData,
    radarChartData,
    polarAreaData,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const prepararDatosParaEmail = () => {
    if (sismos.length === 0) return null;

    const ultimoSismo = sismos[0];
    const fecha = new Date(ultimoSismo.properties.time);
    
    const datosEmail = {
      departamento: filtros.departamento || "Todo Perú",
      fechaInicio: new Date(filtros.starttime).toLocaleDateString('es-ES'),
      fechaFin: new Date(filtros.endtime).toLocaleDateString('es-ES'),
      totalSismos: sismos.length,
      ultimoSismo: {
        fecha: fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        hora: fecha.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        magnitud: ultimoSismo.properties.mag.toFixed(1),
        profundidad: ultimoSismo.geometry.coordinates[2].toFixed(2),
        latitud: ultimoSismo.geometry.coordinates[1].toFixed(4),
        longitud: ultimoSismo.geometry.coordinates[0].toFixed(4),
        intensidad: ultimoSismo.properties.mag < 4.0 ? "Leve" : 
                   ultimoSismo.properties.mag < 6.0 ? "Moderado" : 
                   ultimoSismo.properties.mag < 7.0 ? "Fuerte" : "Severo",
        region: (() => {
          const lat = ultimoSismo.geometry.coordinates[1];
          const lon = ultimoSismo.geometry.coordinates[0];
          
          if (lat < -8) {
            return lon < -75 ? "Costa" : "Sierra";
          } else if (lat < -4) {
            if (lon < -78) return "Costa";
            if (lon < -74) return "Sierra";
            return "Selva";
          } else {
            if (lon < -80) return "Costa";
            if (lon < -76) return "Sierra";
            return "Selva";
          }
        })()
      },
      estadisticas: {
        porRegion: datosPorRegion,
        porIntensidad: datosPorIntensidad,
        porProfundidad: datosPorProfundidad,
        porMes: datosPorMes
      }
    };

    return datosEmail;
  };

  const manejarEnviarReporte = () => {
    setMostrarFormularioEmail(true);
  };

  const manejarCerrarFormularioEmail = () => {
    setMostrarFormularioEmail(false);
  };

  return (
    <>
      <div className={styles.contenedor}>
        <div className={styles.encabezado}>
          <h1>Estadísticas de Sismos en Perú</h1>
          {filtros.departamento && (
            <h2>Departamento: {filtros.departamento}</h2>
          )}
        </div>

        <div className={styles.filtros}>
          <div className={styles.grupoFiltro}>
            <label>Departamento</label>
            <select
              name="departamento"
              value={filtros.departamento}
              onChange={manejarCambioFiltro}
              className={styles.selectorDepartamento}
            >
              <option value="">Todo Perú</option>
              {Object.keys(departamentosPeru).sort().map(depto => (
                <option key={depto} value={depto}>{depto}</option>
              ))}
            </select>
          </div>

          <div className={styles.grupoFiltro}>
            <label>Fecha Inicio</label>
            <input
              type="date"
              name="starttime"
              value={filtros.starttime}
              onChange={manejarCambioFiltro}
            />
          </div>

          <div className={styles.grupoFiltro}>
            <label>Fecha Fin</label>
            <input
              type="date"
              name="endtime"
              value={filtros.endtime}
              onChange={manejarCambioFiltro}
            />
          </div>

          <div className={styles.grupoFiltro}>
            <label>Magnitud Mínima</label>
            <input
              type="number"
              name="minMagnitude"
              value={filtros.minMagnitude}
              onChange={manejarCambioFiltro}
              min={0}
              max={10}
              step="0.1"
            />
          </div>

          <div className={styles.grupoFiltro}>
            <label>Magnitud Máxima</label>
            <input
              type="number"
              name="maxMagnitude"
              value={filtros.maxMagnitude}
              onChange={manejarCambioFiltro}
              min={0}
              max={10}
              step="0.1"
            />
          </div>

          <button className={styles.botonFiltro} onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>

        {cargando ? (
          <div className={styles.mensajeCargando}>
            <div className={styles.spinner}></div>
            Cargando datos...
          </div>
        ) : error ? (
          <div className={styles.mensajeError}>
            {error}
          </div>
        ) : sismos.length === 0 ? (
          <div className={styles.mensajeSinDatos}>
            <h2>No se registraron sismos</h2>
            {filtros.departamento && (
              <p>en el departamento de {filtros.departamento}</p>
            )}
            <p>en el período seleccionado ({new Date(filtros.starttime).toLocaleDateString()} - {new Date(filtros.endtime).toLocaleDateString()})</p>
          </div>
        ) : (
          <>
            <div className={styles.resumenEstadisticas}>
              <div className={styles.tarjetaEstadistica}>
                <h3>Total de Sismos</h3>
                <p>{sismos.length}</p>
              </div>
              <div className={styles.tarjetaEstadistica}>
                <h3>Magnitud Promedio</h3>
                <p>{(sismos.reduce((acc, sismo) => acc + sismo.properties.mag, 0) / sismos.length).toFixed(2)}</p>
              </div>
              <div className={styles.tarjetaEstadistica}>
                <h3>Profundidad Promedio</h3>
                <p>{(sismos.reduce((acc, sismo) => acc + sismo.geometry.coordinates[2], 0) / sismos.length).toFixed(2)} km</p>
              </div>
            </div>

            <div className={styles.contenedorGraficos}>
              <div className={styles.contenedorGrafico}>
                <h2>Tendencia Mensual</h2>
                <Line data={lineChartData} options={chartOptions} />
              </div>

              <div className={styles.contenedorGrafico}>
                <h2>Distribución por Región</h2>
                <Bar data={barChartData} options={chartOptions} />
              </div>

              <div className={styles.contenedorGrafico}>
                <h2>Intensidad de Sismos</h2>
                <Pie data={pieChartData} options={chartOptions} />
              </div>

              <div className={styles.contenedorGrafico}>
                <h2>Profundidad de Sismos</h2>
                <Doughnut data={doughnutChartData} options={chartOptions} />
              </div>

              <div className={styles.contenedorGrafico}>
                <h2>Características del Sismo</h2>
                <Radar data={radarChartData} options={chartOptions} />
              </div>

              <div className={styles.contenedorGrafico}>
                <h2>Distribución Polar de Zonas</h2>
                <PolarArea data={polarAreaData} options={chartOptions} />
              </div>
            </div>

            <div className={styles.seccionUltimoSismo}>
              <h2>Último Sismo Registrado</h2>
              <div className={styles.tarjetaUltimoSismo}>
                <div className={styles.infoUltimoSismo}>
                  <h3>Fecha y Hora</h3>
                  <p>{new Date(sismos[0].properties.time).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p>{new Date(sismos[0].properties.time).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}</p>
                </div>
                <div className={styles.infoUltimoSismo}>
                  <h3>Magnitud</h3>
                  <p>{sismos[0].properties.mag.toFixed(1)}</p>
                </div>
                <div className={styles.infoUltimoSismo}>
                  <h3>Profundidad</h3>
                  <p>{sismos[0].geometry.coordinates[2].toFixed(2)} km</p>
                </div>
                <div className={styles.infoUltimoSismo}>
                  <h3>Ubicación</h3>
                  <p>Latitud: {sismos[0].geometry.coordinates[1].toFixed(4)}°</p>
                  <p>Longitud: {sismos[0].geometry.coordinates[0].toFixed(4)}°</p>
                </div>
                <div className={styles.infoUltimoSismo}>
                  <h3>Intensidad</h3>
                  <p>{sismos[0].properties.mag < 4.0 ? "Leve" : 
                      sismos[0].properties.mag < 6.0 ? "Moderado" : 
                      sismos[0].properties.mag < 7.0 ? "Fuerte" : "Severo"}</p>
                </div>
                <div className={styles.infoUltimoSismo}>
                  <h3>Región</h3>
                  <p>{(() => {
                    const lat = sismos[0].geometry.coordinates[1];
                    const lon = sismos[0].geometry.coordinates[0];
                    
                    if (lat < -8) {
                      return lon < -75 ? "Costa" : "Sierra";
                    } else if (lat < -4) {
                      if (lon < -78) return "Costa";
                      if (lon < -74) return "Sierra";
                      return "Selva";
                    } else {
                      if (lon < -80) return "Costa";
                      if (lon < -76) return "Sierra";
                      return "Selva";
                    }
                  })()}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {!cargando && !error && sismos.length > 0 && (
          <div className={styles.botonReporte}>
            <button onClick={manejarEnviarReporte} className={styles.botonEnviarReporte}>
              Enviar Reporte por Correo
            </button>
          </div>
        )}

        {mostrarFormularioEmail && (
          <div className={styles.overlayFormularioEmail}>
            <div className={styles.contenedorFormularioEmail}>
              <button 
                className={styles.botonCerrar}
                onClick={manejarCerrarFormularioEmail}
              >
                ×
              </button>
              <EmailForm 
                datosEstadisticos={prepararDatosParaEmail()} 
                onClose={manejarCerrarFormularioEmail}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Estadistica;