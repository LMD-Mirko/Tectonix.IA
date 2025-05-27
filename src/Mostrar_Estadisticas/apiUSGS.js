// Coordenadas de los departamentos de Perú
export const departamentosPeru = {
  "Amazonas": { minLat: -7.0, maxLat: -4.0, minLon: -79.0, maxLon: -77.0 },
  "Áncash": { minLat: -10.0, maxLat: -8.0, minLon: -78.0, maxLon: -76.0 },
  "Apurímac": { minLat: -15.0, maxLat: -13.0, minLon: -74.0, maxLon: -72.0 },
  "Arequipa": { minLat: -17.0, maxLat: -15.0, minLon: -74.0, maxLon: -71.0 },
  "Ayacucho": { minLat: -15.0, maxLat: -13.0, minLon: -75.0, maxLon: -73.0 },
  "Cajamarca": { minLat: -8.0, maxLat: -5.0, minLon: -79.0, maxLon: -77.0 },
  "Callao": { minLat: -12.2, maxLat: -12.0, minLon: -77.2, maxLon: -77.0 },
  "Cusco": { minLat: -14.0, maxLat: -12.0, minLon: -73.0, maxLon: -71.0 },
  "Huancavelica": { minLat: -14.0, maxLat: -12.0, minLon: -76.0, maxLon: -74.0 },
  "Huánuco": { minLat: -10.0, maxLat: -8.0, minLon: -77.0, maxLon: -75.0 },
  "Ica": { minLat: -15.0, maxLat: -13.0, minLon: -76.0, maxLon: -74.0 },
  "Junín": { minLat: -12.0, maxLat: -10.0, minLon: -76.0, maxLon: -74.0 },
  "La Libertad": { minLat: -9.0, maxLat: -7.0, minLon: -79.0, maxLon: -77.0 },
  "Lambayeque": { minLat: -7.0, maxLat: -5.0, minLon: -80.0, maxLon: -78.0 },
  "Lima": { minLat: -13.0, maxLat: -11.0, minLon: -77.0, maxLon: -75.0 },
  "Loreto": { minLat: -5.0, maxLat: -2.0, minLon: -76.0, maxLon: -73.0 },
  "Madre de Dios": { minLat: -14.0, maxLat: -11.0, minLon: -72.0, maxLon: -69.0 },
  "Moquegua": { minLat: -18.0, maxLat: -16.0, minLon: -72.0, maxLon: -70.0 },
  "Pasco": { minLat: -11.0, maxLat: -9.0, minLon: -76.0, maxLon: -74.0 },
  "Piura": { minLat: -6.0, maxLat: -4.0, minLon: -81.0, maxLon: -79.0 },
  "Puno": { minLat: -17.0, maxLat: -14.0, minLon: -71.0, maxLon: -69.0 },
  "San Martín": { minLat: -8.0, maxLat: -5.0, minLon: -78.0, maxLon: -76.0 },
  "Tacna": { minLat: -18.0, maxLat: -17.0, minLon: -71.0, maxLon: -69.0 },
  "Tumbes": { minLat: -4.0, maxLat: -3.0, minLon: -81.0, maxLon: -80.0 },
  "Ucayali": { minLat: -11.0, maxLat: -8.0, minLon: -75.0, maxLon: -73.0 }
};

export const obtenerSismos = async ({ starttime, endtime, minMagnitude, maxMagnitude, departamento }) => {
  let params = {
    format: "geojson",
    starttime,
    endtime,
    minmagnitude: minMagnitude,
    maxmagnitude: maxMagnitude,
    limit: 1000,
    orderby: "time"
  };

  // Si se selecciona un departamento, usar sus coordenadas
  if (departamento && departamentosPeru[departamento]) {
    const coords = departamentosPeru[departamento];
    params = {
      ...params,
      minlatitude: coords.minLat,
      maxlatitude: coords.maxLat,
      minlongitude: coords.minLon,
      maxlongitude: coords.maxLon
    };
  } else {
    // Si no hay departamento seleccionado, usar todo Perú
    params = {
      ...params,
      minlatitude: -18.5,
      maxlatitude: 0.0,
      minlongitude: -81.5,
      maxlongitude: -68.5
    };
  }

  try {
    const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${new URLSearchParams(params).toString()}`);
    if (!response.ok) throw new Error("Error al obtener datos de sismos");
    const data = await response.json();
    return data.features;
  } catch (error) {
    console.error("Error en la petición a USGS:", error);
    throw error;
  }
};
