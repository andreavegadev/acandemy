import styles from "./Select.module.css";
import { useId } from "react";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  style,
  required = false,
}) => {
  const id = useId();
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={id}>
        {label}{required ? " *" : ""}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.select} ${error ? styles.error : ""}`}
        disabled={disabled}
        required={required}
        style={style}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p style={{ color: "red", marginTop: 4 }}>{error}</p>}
    </div>
  );
};

export default Select;