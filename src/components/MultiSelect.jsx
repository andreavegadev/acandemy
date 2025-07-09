import styles from "./MultiSelect.module.css";
import { useId } from "react";

const MultiSelect = ({
  label,
  name,
  value = [],
  onChange,
  options = [],
  error,
  disabled = false,
  style,
  ...props
}) => {
  const id = useId();
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.multiselect} ${error ? styles.error : ""}`}
        disabled={disabled}
        multiple
        style={style}
        {...props}
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

export default MultiSelect;