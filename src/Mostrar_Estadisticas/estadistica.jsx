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
    starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endtime: new Date().toISOString().split('T')[0],
    minMagnitude: 0,
    maxMagnitude: 10,
    departamento: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(false);
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
      
      // Clasificación más precisa para Perú
      if (lat < -8) {
        // Sur del Perú
        if (lon < -75) regiones["Costa"]++;
        else regiones["Sierra"]++;
      } else if (lat < -4) {
        // Centro del Perú
        if (lon < -78) regiones["Costa"]++;
        else if (lon < -74) regiones["Sierra"]++;
        else regiones["Selva"]++;
      } else {
        // Norte del Perú
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

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
      borderColor: "#FF4B2B",
      backgroundColor: "rgba(255, 75, 43, 0.1)",
      tension: 0.4,
    }],
  };

const barChartData = {
  labels: Object.keys(datosPorRegion),
  datasets: [{
    label: "Sismos por Región en Perú",
    data: Object.values(datosPorRegion),
    backgroundColor: [
      "rgba(0, 0, 0, 0.9)",        // Negro puro
      "rgba(31, 41, 55, 0.8)",     // Negro azulado
      "rgba(55, 65, 81, 0.8)",     // Gris carbón
      "rgba(75, 85, 99, 0.7)",     // Gris oscuro
      "rgba(107, 114, 128, 0.7)",  // Gris medio
      "rgba(156, 163, 175, 0.6)",  // Gris claro
    ],
  }],
};

const pieChartData = {
  labels: Object.keys(datosPorIntensidad),
  datasets: [{
    data: Object.values(datosPorIntensidad),
    backgroundColor: [
      "rgba(0, 0, 0, 0.9)",        // Negro puro
      "rgba(17, 24, 39, 0.8)",     // Negro suave
      "rgba(55, 65, 81, 0.8)",     // Gris carbón
      "rgba(107, 114, 128, 0.7)",  // Gris medio
      "rgba(156, 163, 175, 0.6)",  // Gris claro
    ],
  }],
};

const doughnutChartData = {
  labels: Object.keys(datosPorProfundidad),
  datasets: [{
    data: Object.values(datosPorProfundidad),
    backgroundColor: [
      "rgba(0, 0, 0, 0.9)",        // Negro puro
      "rgba(31, 41, 55, 0.8)",     // Negro azulado
      "rgba(75, 85, 99, 0.8)",     // Gris oscuro
      "rgba(107, 114, 128, 0.7)",  // Gris medio
    ],
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
      backgroundColor: "rgba(255, 75, 43, 0.2)",
      borderColor: "#FF4B2B",
      borderWidth: 2,
    }],
  };

  const polarAreaData = {
    labels: Object.keys(datosPorRegion),
    datasets: [{
      label: "Distribución Sísmica en Perú",
      data: Object.values(datosPorRegion),
      backgroundColor: [
        "rgba(0, 0, 0, 0.9)",        // Negro puro
        "rgba(31, 41, 55, 0.8)",     // Negro azulado
        "rgba(75, 85, 99, 0.8)",     // Gris oscuro
        "rgba(107, 114, 128, 0.7)",  // Gris medio
      ],
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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Estadísticas de Sismos en Perú</h1>
          {filtros.departamento && (
            <h2>Departamento: {filtros.departamento}</h2>
          )}
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Departamento</label>
            <select
              name="departamento"
              value={filtros.departamento}
              onChange={handleFiltroChange}
              className={styles.departmentSelect}
            >
              <option value="">Todo Perú</option>
              {Object.keys(departamentosPeru).sort().map(depto => (
                <option key={depto} value={depto}>{depto}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Fecha Inicio</label>
            <input
              type="date"
              name="starttime"
              value={filtros.starttime}
              onChange={handleFiltroChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Fecha Fin</label>
            <input
              type="date"
              name="endtime"
              value={filtros.endtime}
              onChange={handleFiltroChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Magnitud Mínima</label>
            <input
              type="number"
              name="minMagnitude"
              value={filtros.minMagnitude}
              onChange={handleFiltroChange}
              min={0}
              max={10}
              step="0.1"
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Magnitud Máxima</label>
            <input
              type="number"
              name="maxMagnitude"
              value={filtros.maxMagnitude}
              onChange={handleFiltroChange}
              min={0}
              max={10}
              step="0.1"
            />
          </div>

          <button className={styles.filterButton} onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingMessage}>
            <div className={styles.spinner}></div>
            Cargando datos...
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            {error}
          </div>
        ) : sismos.length === 0 ? (
          <div className={styles.noDataMessage}>
            <h2>No se registraron sismos</h2>
            {filtros.departamento && (
              <p>en el departamento de {filtros.departamento}</p>
            )}
            <p>en el período seleccionado ({new Date(filtros.starttime).toLocaleDateString()} - {new Date(filtros.endtime).toLocaleDateString()})</p>
          </div>
        ) : (
          <>
            <div className={styles.statsSummary}>
              <div className={styles.statCard}>
                <h3>Total de Sismos</h3>
                <p>{sismos.length}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Magnitud Promedio</h3>
                <p>{(sismos.reduce((acc, sismo) => acc + sismo.properties.mag, 0) / sismos.length).toFixed(2)}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Profundidad Promedio</h3>
                <p>{(sismos.reduce((acc, sismo) => acc + sismo.geometry.coordinates[2], 0) / sismos.length).toFixed(2)} km</p>
              </div>
            </div>

            <div className={styles.chartsContainer}>
              <div className={styles.chartWrapper}>
                <h2>Tendencia Mensual</h2>
                <Line data={lineChartData} options={chartOptions} />
              </div>

              <div className={styles.chartWrapper}>
                <h2>Distribución por Región</h2>
                <Bar data={barChartData} options={chartOptions} />
              </div>

              <div className={styles.chartWrapper}>
                <h2>Intensidad de Sismos</h2>
                <Pie data={pieChartData} options={chartOptions} />
              </div>

              <div className={styles.chartWrapper}>
                <h2>Profundidad de Sismos</h2>
                <Doughnut data={doughnutChartData} options={chartOptions} />
              </div>

              <div className={styles.chartWrapper}>
                <h2>Características del Sismo</h2>
                <Radar data={radarChartData} options={chartOptions} />
              </div>

              <div className={styles.chartWrapper}>
                <h2>Distribución Polar de Zonas</h2>
                <PolarArea data={polarAreaData} options={chartOptions} />
              </div>
            </div>

            <div className={styles.lastEarthquakeSection}>
              <h2>Último Sismo Registrado</h2>
              <div className={styles.lastEarthquakeCard}>
                <div className={styles.lastEarthquakeInfo}>
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
                <div className={styles.lastEarthquakeInfo}>
                  <h3>Magnitud</h3>
                  <p>{sismos[0].properties.mag.toFixed(1)}</p>
                </div>
                <div className={styles.lastEarthquakeInfo}>
                  <h3>Profundidad</h3>
                  <p>{sismos[0].geometry.coordinates[2].toFixed(2)} km</p>
                </div>
                <div className={styles.lastEarthquakeInfo}>
                  <h3>Ubicación</h3>
                  <p>Latitud: {sismos[0].geometry.coordinates[1].toFixed(4)}°</p>
                  <p>Longitud: {sismos[0].geometry.coordinates[0].toFixed(4)}°</p>
                </div>
                <div className={styles.lastEarthquakeInfo}>
                  <h3>Intensidad</h3>
                  <p>{sismos[0].properties.mag < 4.0 ? "Leve" : 
                      sismos[0].properties.mag < 6.0 ? "Moderado" : 
                      sismos[0].properties.mag < 7.0 ? "Fuerte" : "Severo"}</p>
                </div>
                <div className={styles.lastEarthquakeInfo}>
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
      </div>
    </>
  );
}

export default Estadistica;