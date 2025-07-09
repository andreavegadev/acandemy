import styles from "./Input.module.css";
import { useId } from "react";

const Input = ({
  label,
  type = "text",
  value,
  name,
  onChange,
  placeholder,
  error,
  autoComplete,
  readOnly,
  fullWidth,
}) => {
  const id = useId();
  const inputContainerStyles = `${styles.inputContainer} ${
    fullWidth ? styles.fullWidth : ""
  }`;
  const inputStyles = `${styles.input} ${error ? styles.error : ""}`;
  return (
    <div className={inputContainerStyles}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete ? "on" : "off"}
        id={id}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        className={inputStyles}
        readOnly={readOnly}
      />
      {error && <p style={{ color: "red", marginTop: 4 }}>{error}</p>}
    </div>
  );
};

export default Input;
