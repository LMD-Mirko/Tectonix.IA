import React from "react";
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
  // Sample data for charts
  const lineChartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Sismos por Mes",
        data: [12, 19, 15, 25, 22, 30],
        borderColor: "#000000",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ["Costa", "Sierra", "Selva"],
    datasets: [
      {
        label: "Sismos por Región",
        data: [45, 30, 25],
        backgroundColor: [
          "rgba(0, 0, 0, 0.8)",
          "rgba(0, 0, 0, 0.6)",
          "rgba(0, 0, 0, 0.4)",
        ],
      },
    ],
  };

  const pieChartData = {
    labels: ["Leve", "Moderado", "Fuerte"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: [
          "rgba(0, 0, 0, 0.3)",
          "rgba(0, 0, 0, 0.6)",
          "rgba(0, 0, 0, 0.9)",
        ],
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Profundo", "Medio", "Superficial"],
    datasets: [
      {
        data: [25, 45, 30],
        backgroundColor: [
          "rgba(0, 0, 0, 0.2)",
          "rgba(0, 0, 0, 0.5)",
          "rgba(0, 0, 0, 0.8)",
        ],
      },
    ],
  };

  const radarChartData = {
    labels: ["Magnitud", "Profundidad", "Frecuencia", "Intensidad", "Duración"],
    datasets: [
      {
        label: "Características del Sismo",
        data: [65, 59, 90, 81, 56],
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderColor: "#000000",
        borderWidth: 2,
      },
    ],
  };

  const polarAreaData = {
    labels: ["Costa", "Sierra", "Selva"],
    datasets: [
      {
        label: "Distribución Sísmica",
        data: [35, 45, 20],
        backgroundColor: [
          "rgba(0, 0, 0, 0.3)",
          "rgba(0, 0, 0, 0.5)",
          "rgba(0, 0, 0, 0.7)",
        ],
      },
    ],
  };

  // Prepare statistics data for email
  const statisticsData = {
    lineChartData: {
      labels: lineChartData.labels,
      data: lineChartData.datasets[0].data
    },
    barChartData: {
      labels: barChartData.labels,
      data: barChartData.datasets[0].data
    },
    pieChartData: {
      labels: pieChartData.labels,
      data: pieChartData.datasets[0].data
    },
    doughnutChartData: {
      labels: doughnutChartData.labels,
      data: doughnutChartData.datasets[0].data
    },
    radarChartData: {
      labels: radarChartData.labels,
      data: radarChartData.datasets[0].data
    },
    polarAreaData: {
      labels: polarAreaData.labels,
      data: polarAreaData.datasets[0].data
    }
  };

  // Agregar console.log para depuración
  console.log('statisticsData a enviar:', statisticsData);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Estadísticas de Sismos</h1>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Zona Sísmica</label>
            <select>
              <option value="">Todas</option>
              <option value="Costa">Costa</option>
              <option value="Sierra">Sierra</option>
              <option value="Selva">Selva</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Profundidad (km)</label>
            <div className={styles.rangeInputs}>
              <input type="number" placeholder="Mín" min={0} />
              <input type="number" placeholder="Máx" min={0} />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Magnitud</label>
            <select>
              <option value="">Todos</option>
              <option value="Leve">Leve</option>
              <option value="Moderado">Moderado</option>
              <option value="Fuerte">Fuerte</option>
            </select>
          </div>

          <button className={styles.filterButton}>Limpiar filtros</button>
        </div>

        <div className={styles.chartsContainer}>
          <div className={styles.chartWrapper}>
            <h2>Tendencia Mensual</h2>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>

          <div className={styles.chartWrapper}>
            <h2>Distribución por Región</h2>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>

          <div className={styles.chartWrapper}>
            <h2>Intensidad de Sismos</h2>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>

          <div className={styles.chartWrapper}>
            <h2>Profundidad de Sismos</h2>
            <Doughnut
              data={doughnutChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>

          <div className={styles.chartWrapper}>
            <h2>Características del Sismo</h2>
            <Radar
              data={radarChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>

          <div className={styles.chartWrapper}>
            <h2>Distribución Polar de Zonas</h2>
            <PolarArea
              data={polarAreaData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Add Email Form Section */}
        <div className={styles.emailFormSection}>
          <EmailForm />
        </div>
      </div>
    </>
  );
}

export default Estadistica;