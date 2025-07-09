import styles from "./Select.module.css";
import { useId, useState, useRef, useEffect } from "react";

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
  multiple = false,
  size,
}) => {
  const selectId = useId();
  const multiSelectId = useId();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const firstOptionRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close multiselect when clicking outside
  useEffect(() => {
    if (!multiple) return;
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [multiple]);

  // Manage focus when dropdown opens/closes
  useEffect(() => {
    if (!multiple) return;

    if (isOpen) {
      // Move focus to first option
      setTimeout(() => {
        firstOptionRef.current?.focus();
      }, 0);
    } else {
      // Move focus back to button
      buttonRef.current?.focus();
    }
  }, [isOpen, multiple]);

  const toggleOption = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  if (!multiple) {
    return (
      <div className={styles.inputContainer} style={style}>
        <label className={styles.label} htmlFor={selectId}>
          {label}
          {required ? " *" : ""}
        </label>
        <div className={styles.selectContainer}>
          <select
            id={selectId}
            name={name}
            value={value}
            onChange={(e) => onChange(e)}
            className={`${styles.select} ${error ? styles.error : ""}`}
            disabled={disabled}
            required={required}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className={styles.dropdownMarker}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="inherit"
            >
              <g data-name="Layer 2">
                <g data-name="chevron-down">
                  <rect width="24" height="24" opacity="0"></rect>
                  <path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path>
                </g>
              </g>
            </svg>
          </span>
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }

  // Multiple select (custom dropdown with hidden native select)
  return (
    <div className={styles.inputContainer} style={style} ref={containerRef}>
      <label className={styles.label} htmlFor={multiSelectId}>
        {label}
        {required ? " *" : ""}
      </label>

      {/* Hidden native multiple select */}
      <select
        id={multiSelectId}
        name={name}
        multiple
        value={value}
        onChange={(e) => onChange(e)}
        className={styles.hiddenSelect}
        disabled={disabled}
        required={required}
        tabIndex={-1}
        inert
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown button */}
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.select} ${styles.customSelectButton} ${
          error ? styles.error : ""
        }`}
        onClick={() => !disabled && setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        {value.length > 0
          ? options
              .filter((opt) => value.includes(opt.value))
              .map((opt) => opt.label)
              .join(", ")
          : "Selecciona opciones"}
        <span className={styles.dropdownMarker}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="inherit"
          >
            <g data-name="Layer 2">
              <g data-name="chevron-down">
                <rect width="24" height="24" opacity="0"></rect>
                <path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"></path>
              </g>
            </g>
          </svg>
        </span>
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {isOpen && (
        <ul
          className={styles.customDropdown}
          role="listbox"
          aria-multiselectable={true}
          tabIndex={-1}
          style={{ maxHeight: size ? size * 30 : 120 }}
        >
          {options.map((opt, index) => (
            <li
              key={opt.value}
              ref={index === 0 ? firstOptionRef : null}
              role="option"
              aria-selected={value.includes(opt.value)}
              onClick={() => toggleOption(opt.value)}
              className={
                value.includes(opt.value)
                  ? styles.customDropdownItemSelected
                  : styles.customDropdownItem
              }
              tabIndex={0}
            >
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
                onClick={(e) => e.stopPropagation()}
                className={styles.checkbox}
                tabIndex={-1}
              />
              <span className={styles.optionLabel}>{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
