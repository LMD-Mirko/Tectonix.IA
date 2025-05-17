import React from 'react';
import { Button } from 'antd';
import styles from './Error.module.css';
import imgerror from '../assets/error404.png';
import FondoAnimado from './Movimiento';

const Error404 = () => {
  return (
    <div className={styles.errorPage}>
      <FondoAnimado />
      <div className={styles.errorTag}>ERROR</div>
      <div className={styles.errorContent}>
        <div className={styles.errorImage}>
          <img src={imgerror} alt="Error 404" />
        </div>
        <div className={styles.errorText}>
          <h1>Oops!</h1>
          <h1>Oops!!</h1>
          <h2>Página no encontrada</h2>
          <p>No pudimos encontrar lo que buscabas. Puede que<br />la página haya sido movida o eliminada.</p>
          <Button type="primary" className={styles.backButton}>
            Volver a inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error404;