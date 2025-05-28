import { departamentosPeru, obtenerSismos } from '../Mostrar_Estadisticas/apiUSGS.js';

// Función para obtener datos de sismos del IGP usando un proxy
const obtenerSismosIGP = async () => {
    try {
        // Usar un proxy CORS más simple
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
            console.log('Datos parseados:', sismosData);
        } catch (error) {
            console.error('Error al parsear JSON:', error);
            console.log('Contenido recibido:', data.contents);
            return [];
        }

        // Verificar si los datos están en el formato esperado
        if (!sismosData || typeof sismosData !== 'object') {
            console.error('Formato de datos inválido:', sismosData);
            return [];
        }

        // Intentar extraer el array de sismos del objeto
        let sismosArray;
        if (Array.isArray(sismosData)) {
            sismosArray = sismosData;
        } else if (Array.isArray(sismosData.data)) {
            sismosArray = sismosData.data;
        } else if (Array.isArray(sismosData.sismos)) {
            sismosArray = sismosData.sismos;
        } else {
            console.error('No se encontró un array de sismos en los datos:', sismosData);
            return [];
        }

        console.log('Array de sismos encontrado:', sismosArray);

        // Procesar los datos del IGP
        const sismosProcesados = sismosArray.map(sismo => {
            try {
                // Extraer fecha y hora
                const fechaHora = new Date(sismo.fecha || sismo.fecha_local || sismo.tiempo);
                if (isNaN(fechaHora.getTime())) {
                    console.warn('Fecha inválida:', sismo.fecha || sismo.fecha_local || sismo.tiempo);
                    return null;
                }

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
                const latitud = parseFloat(sismo.latitud || sismo.lat);
                const longitud = parseFloat(sismo.longitud || sismo.lon);

                if (!isNaN(latitud) && !isNaN(longitud)) {
                    for (const [depto, coords] of Object.entries(departamentosPeru)) {
                        if (latitud >= coords.minLat && latitud <= coords.maxLat && 
                            longitud >= coords.minLon && longitud <= coords.maxLon) {
                            departamento = depto;
                            break;
                        }
                    }
                }

                return {
                    id: `IGP${fechaHora.getTime()}`,
                    fechaLocal,
                    horaLocal,
                    latitud,
                    longitud,
                    profundidad: parseFloat(sismo.profundidad || sismo.depth || 0),
                    magnitud: parseFloat(sismo.magnitud || sismo.mag || 0),
                    ubicacion: sismo.ubicacion || sismo.localizacion || sismo.location || 'No especificada',
                    departamento,
                    intensidad: sismo.intensidad || sismo.intensity || 'No especificada',
                    estado: sismo.estado || sismo.status || 'Automático'
                };
            } catch (error) {
                console.error('Error al procesar sismo:', error);
                return null;
            }
        }).filter(sismo => sismo !== null);

        if (sismosProcesados.length === 0) {
            console.log('No se pudieron procesar los datos');
            return [];
        }

        console.log('Sismos procesados:', sismosProcesados);
        return sismosProcesados;
    } catch (error) {
        console.error('Error al obtener sismos del IGP:', error);
        return [];
    }
};

// Función para calcular la probabilidad de sismos basada en datos históricos
const calcularProbabilidadSismo = async (departamento, diasAnalisis = 90) => {
    try {
        // Obtener fecha actual y fecha de inicio del análisis
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - diasAnalisis);

        // Formatear fechas para la API
        const starttime = startDate.toISOString();
        const endtime = endDate.toISOString();

        console.log('Consultando sismos para:', departamento);
        console.log('Período:', starttime, 'a', endtime);

        // Obtener datos históricos de sismos
        const sismos = await obtenerSismos({
            starttime,
            endtime,
            minMagnitude: 2.5,
            maxMagnitude: 10,
            departamento
        });

        // Obtener datos recientes del IGP
        const sismosIGP = await obtenerSismosIGP();
        console.log('Sismos IGP encontrados:', sismosIGP.length);

        // Combinar datos históricos con datos recientes del IGP
        const todosLosSismos = [...sismos, ...sismosIGP];

        console.log('Total de sismos analizados:', todosLosSismos.length);

        // Calcular estadísticas básicas
        const totalSismos = todosLosSismos.length;
        const sismosPorDia = totalSismos / diasAnalisis;

        // Análisis de magnitud
        const magnitudes = todosLosSismos.map(s => s.properties?.mag || s.magnitud);
        const magnitudPromedio = magnitudes.length > 0 
            ? magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length 
            : 0;
        const magnitudMaxima = Math.max(...magnitudes, 0);
        const magnitudMinima = Math.min(...magnitudes, 0);

        // Análisis de profundidad
        const profundidades = todosLosSismos.map(s => s.geometry?.coordinates?.[2] || s.profundidad);
        const profundidadPromedio = profundidades.length > 0 
            ? profundidades.reduce((a, b) => a + b, 0) / profundidades.length 
            : 0;

        // Análisis temporal
        const sismosPorHora = new Array(24).fill(0);
        const sismosPorDiaSemana = new Array(7).fill(0);
        
        todosLosSismos.forEach(sismo => {
            const fecha = new Date(sismo.properties?.time || `${sismo.fecha} ${sismo.hora}`);
            sismosPorHora[fecha.getHours()]++;
            sismosPorDiaSemana[fecha.getDay()]++;
        });

        const horaMasActiva = sismosPorHora.indexOf(Math.max(...sismosPorHora));
        const diaMasActivo = sismosPorDiaSemana.indexOf(Math.max(...sismosPorDiaSemana));

        // Calcular probabilidades basadas en múltiples factores
        const calcularProbabilidad = () => {
            // Factor de frecuencia
            const factorFrecuencia = sismosPorDia / 2; // Normalizado a un rango de 0-1

            // Factor de magnitud
            const factorMagnitud = magnitudPromedio / 7; // Normalizado considerando que 7 es una magnitud significativa

            // Factor de profundidad
            const factorProfundidad = profundidadPromedio > 100 ? 0.8 : 
                                    profundidadPromedio > 50 ? 0.6 : 
                                    profundidadPromedio > 30 ? 0.4 : 0.2;

            // Factor de actividad reciente (últimos 7 días)
            const sismosRecientes = todosLosSismos.filter(s => {
                const fecha = new Date(s.properties?.time || `${s.fecha} ${s.hora}`);
                const ahora = new Date();
                return (ahora - fecha) <= 7 * 24 * 60 * 60 * 1000;
            }).length;
            const factorActividadReciente = sismosRecientes / 10; // Normalizado

            // Cálculo de probabilidad ponderada
            const probabilidadBase = (
                factorFrecuencia * 0.3 +
                factorMagnitud * 0.3 +
                factorProfundidad * 0.2 +
                factorActividadReciente * 0.2
            );

            return {
                probabilidadBase: Math.min(Math.max(probabilidadBase, 0), 1),
                factorFrecuencia,
                factorMagnitud,
                factorProfundidad,
                factorActividadReciente
            };
        };

        const { probabilidadBase, factorFrecuencia, factorMagnitud, factorProfundidad, factorActividadReciente } = calcularProbabilidad();

        // Calcular probabilidades para diferentes períodos
        const probabilidadDiaria = probabilidadBase;
        const probabilidadSemanal = Math.min(probabilidadBase * 3, 1);
        const probabilidadMensual = Math.min(probabilidadBase * 5, 1);

        // Determinar nivel de riesgo
        const determinarNivelRiesgo = (probabilidad) => {
            if (probabilidad < 0.2) return "BAJO";
            if (probabilidad < 0.4) return "MEDIO";
            if (probabilidad < 0.6) return "ALTO";
            return "MUY ALTO";
        };

        const resultado = {
            departamento,
            estadisticas: {
                totalSismos,
                sismosPorDia: sismosPorDia.toFixed(2),
                magnitudPromedio: magnitudPromedio.toFixed(2),
                magnitudMaxima: magnitudMaxima.toFixed(2),
                magnitudMinima: magnitudMinima.toFixed(2),
                profundidadPromedio: profundidadPromedio.toFixed(2),
                horaMasActiva,
                diaMasActivo,
                probabilidades: {
                    diaria: (probabilidadDiaria * 100).toFixed(2) + '%',
                    semanal: (probabilidadSemanal * 100).toFixed(2) + '%',
                    mensual: (probabilidadMensual * 100).toFixed(2) + '%'
                },
                nivelRiesgo: determinarNivelRiesgo(probabilidadMensual),
                factores: {
                    frecuencia: (factorFrecuencia * 100).toFixed(2) + '%',
                    magnitud: (factorMagnitud * 100).toFixed(2) + '%',
                    profundidad: (factorProfundidad * 100).toFixed(2) + '%',
                    actividadReciente: (factorActividadReciente * 100).toFixed(2) + '%'
                }
            }
        };

        console.log('Resultado de la predicción:', resultado);
        return resultado;
    } catch (error) {
        console.error('Error al calcular probabilidad:', error);
        throw error;
    }
};

// Función para obtener predicciones para todos los departamentos
const obtenerPrediccionesTodosDepartamentos = async () => {
    const predicciones = {};
    for (const departamento of Object.keys(departamentosPeru)) {
        try {
            predicciones[departamento] = await calcularProbabilidadSismo(departamento);
        } catch (error) {
            console.error(`Error al obtener predicción para ${departamento}:`, error);
            predicciones[departamento] = {
                error: 'No se pudo obtener la predicción'
            };
        }
    }
    return predicciones;
};

// Función para obtener predicción para un departamento específico
const obtenerPrediccionDepartamento = async (departamento) => {
    if (!departamentosPeru[departamento]) {
        throw new Error('Departamento no válido');
    }
    return await calcularProbabilidadSismo(departamento);
};

export {
    obtenerPrediccionesTodosDepartamentos,
    obtenerPrediccionDepartamento,
    departamentosPeru,
    obtenerSismosIGP
}; 