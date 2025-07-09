import styles from "./Input.module.css";
import { useId } from "react";

const TextArea = ({
  label,
  value,
  name,
  onChange,
  placeholder,
  error,
  autoComplete,
  readOnly,
  rows = 4,
}) => {
  const id = useId();
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea
        autoComplete={autoComplete ? "on" : "off"}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        className={`${styles.textarea} ${error ? styles.error : ""}`}
        readOnly={readOnly}
      />
      {error && <p style={{ color: "red", marginTop: 4 }}>{error}</p>}
    </div>
  );
};

export default TextArea;
