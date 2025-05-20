import React from 'react';
import styles from '../Mostrar_Estadisticas/estadistica.module.css';

function Estadistica() {
    return (
        <div>
            <div className={styles['top-bar']}>Div en blanco - menu</div> {/* Div en blanco con texto */}
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <main className={styles['estadisticas-main']}>
                        <aside className={styles.filtros}>
                            <div className={styles['filtros-header']}>
                                <span className={styles.icono}>⏷</span> Filtrar
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label className={styles.label}>Zona Sísmica</label>
                                <select className={styles.select}>
                                    <option value="">Todas</option>
                                    <option value="Costa">Costa</option>
                                    <option value="Sierra">Sierra</option>
                                    <option value="Selva">Selva</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label className={styles.label}>Profundidad (km)</label>
                                <div className={styles['edad-inputs']}>
                                    <input type="number" placeholder="Mín" min={0} />
                                    <input type="number" placeholder="Máx" min={0} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 19 }}>
                                <label className={styles.label}>Magnitud</label>
                                <select className={styles.select}>
                                    <option value="">Todos</option>
                                    <option value="Leve">Pequeño</option>
                                    <option value="Moderado">Mediano</option>
                                    <option value="Fuerte">Grande</option>
                                </select>
                            </div>

                            <button className={styles.button}>Limpiar filtros</button>
                        </aside>
                    </main>

                    <div className={styles.statistics}>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2tEhzgE3fFQagyPg7B2fEVIDpqPyLJbe_Wg&s"
                            alt="Line Chart"
                            className={`${styles['statistic-image']} ${styles.lineChart}`}
                        />
                        <img
                            src="https://tudashboard.com/wp-content/uploads/2022/02/Grafica-pie-v2-300x253.png"
                            alt="Pie Chart"
                            className={`${styles['statistic-image']} ${styles.pieChart}`}
                        />
                        <img
                            src="https://www.slideteam.net/wp/wp-content/uploads/2023/04/Impulsores-de-aumento-de-la-eficiencia-con-grafico-de-barras-horizontales-2.png"
                            alt="Bar Chart"
                            className={`${styles['statistic-image']} ${styles.barChart}`}
                        />
                    </div>
                </div>
            </div>

            {/* Sección de fotos */}
            <div className={styles['new-section']}>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7DLiBJRTOvnKfjN3AaC2Z62Q3o8194rbGZQ&s"
                    alt="Foto 1"
                    className={styles['foto1']}
                />
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQiHtbow0Wzzi89kv2CfFnxXUFKOb356i6w&s"
                    alt="Foto 2"
                    className={styles['foto2']}
                />
            </div>
        </div>
    );
}

export default Estadistica;
