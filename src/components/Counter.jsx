import React from "react";
import styles from "./Counter.module.css";

export const Counter = ({
  value,
  onChange,
  min = 1,
  max = Infinity,
  id,
  name,
  fullWidth,
}) => {
  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= min && val <= max) {
      onChange(val);
    }
  };

  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  const counterStyles = `${styles.counter} ${
    fullWidth ? styles.fullWidth : ""
  }`;

  return (
    <div className={counterStyles}>
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className={styles.button}
        aria-label="Decrease quantity"
      >
        –
      </button>

      <input
        type="number"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className={styles.input}
      />

      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className={styles.button}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};
