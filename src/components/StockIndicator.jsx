import React from "react";
import styles from "./StockIndicator.module.css";

const getStockStatus = (stock) => {
  if (stock === 0) return "none";
  if (stock <= 5) return "low";
  return "ok";
};

export const StockIndicator = ({ stock }) => {
  const status = getStockStatus(stock);

  return (
    <div className={styles.container}>
      <span className={`${styles.pulseDot} ${styles[status]}`} />
      <span className={styles.label}>
        {stock === 0
          ? "Sin stock"
          : stock <= 5
          ? `Stock bajo (${stock})`
          : `Stock disponible: ${stock}`}
      </span>
    </div>
  );
};
