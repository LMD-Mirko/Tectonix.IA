import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import styles from './mapa.module.css';
import { obtenerSismos } from '../Mostrar_Estadisticas/apiUSGS';
import Nav from "../componentes/Nav";

// Importar los estilos de Leaflet
import 'leaflet/dist/leaflet.css';

// Corregir el problema de los íconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración del ícono personalizado para los sismos
const sismoIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Límites de Perú
const PERU_BOUNDS = [
  [-18.5, -81.5], // Suroeste
  [-0.5, -68.5]   // Noreste
];

const Mapa = () => {
  const [sismos, setSismos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endtime: new Date().toISOString().split('T')[0],
    minMagnitude: 0,
    maxMagnitude: 10,
    departamento: ""
  });

  useEffect(() => {
    cargarSismos();
  }, [filtros]);

  const cargarSismos = async () => {
    try {
      setCargando(true);
      const datos = await obtenerSismos(filtros);
      setSismos(datos);
    } catch (error) {
      console.error("Error al cargar sismos:", error);
      setError("Error al cargar los datos de sismos");
    } finally {
      setCargando(false);
    }
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
      starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endtime: new Date().toISOString().split('T')[0],
      minMagnitude: 0,
      maxMagnitude: 10,
      departamento: ""
    });
  };

  const obtenerColorPorMagnitud = (magnitud) => {
    if (magnitud < 4.0) return '#000000';
    if (magnitud < 5.0) return '#333333';
    if (magnitud < 6.0) return '#666666';
    if (magnitud < 7.0) return '#999999';
    return '#cccccc';
  };

  const obtenerRadioPorMagnitud = (magnitud) => {
    return Math.pow(1.5, magnitud);
  };

  return (
    <>
      <Nav />
      <main className={styles.mainContainer}>
        <div className={styles.contenedor}>
          <div className={styles.encabezado}>
            <h1>Mapa de Sismos en Perú</h1>
            <p>Visualización en tiempo real de la actividad sísmica</p>
          </div>

          <div className={styles.contenedorPrincipal}>
            <aside className={styles.filtros}>
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
            </aside>

            {cargando ? (
              <div className={styles.mensajeCargando}>
                <div className={styles.spinner}></div>
                Cargando datos...
              </div>
            ) : error ? (
              <div className={styles.mensajeError}>
                {error}
              </div>
            ) : (
              <div className={styles.contenedorMapa}>
                <MapContainer
                  center={[-9.1900, -75.0152]}
                  zoom={6}
                  className={styles.mapa}
                  maxBounds={PERU_BOUNDS}
                  maxBoundsViscosity={1.0}
                  zoomControl={false}
                >
                  <ZoomControl position="bottomright" />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    bounds={PERU_BOUNDS}
                  />
                  
                  {sismos.map((sismo, index) => {
                    const [longitud, latitud, profundidad] = sismo.geometry.coordinates;
                    const magnitud = sismo.properties.mag;
                    const fecha = new Date(sismo.properties.time);
                    
                    return (
                      <CircleMarker
                        key={index}
                        center={[latitud, longitud]}
                        radius={obtenerRadioPorMagnitud(magnitud)}
                        pathOptions={{
                          color: obtenerColorPorMagnitud(magnitud),
                          fillColor: obtenerColorPorMagnitud(magnitud),
                          fillOpacity: 0.7,
                          weight: 1
                        }}
                      >
                        <Popup>
                          <div className={styles.contenidoPopup}>
                            <h3>Sismo M{magnitud.toFixed(1)}</h3>
                            <p><strong>Fecha:</strong> {fecha.toLocaleDateString()}</p>
                            <p><strong>Hora:</strong> {fecha.toLocaleTimeString()}</p>
                            <p><strong>Profundidad:</strong> {profundidad.toFixed(2)} km</p>
                            <p><strong>Ubicación:</strong> {latitud.toFixed(4)}°, {longitud.toFixed(4)}°</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>

                <div className={styles.leyenda}>
                  <h3>Leyenda</h3>
                  <div className={styles.elementoLeyenda}>
                    <div className={styles.colorLeyenda} style={{ backgroundColor: '#000000' }}></div>
                    <span>M &lt; 4.0</span>
                  </div>
                  <div className={styles.elementoLeyenda}>
                    <div className={styles.colorLeyenda} style={{ backgroundColor: '#333333' }}></div>
                    <span>4.0 - 4.9</span>
                  </div>
                  <div className={styles.elementoLeyenda}>
                    <div className={styles.colorLeyenda} style={{ backgroundColor: '#666666' }}></div>
                    <span>5.0 - 5.9</span>
                  </div>
                  <div className={styles.elementoLeyenda}>
                    <div className={styles.colorLeyenda} style={{ backgroundColor: '#999999' }}></div>
                    <span>6.0 - 6.9</span>
                  </div>
                  <div className={styles.elementoLeyenda}>
                    <div className={styles.colorLeyenda} style={{ backgroundColor: '#cccccc' }}></div>
                    <span>M ≥ 7.0</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Mapa;
