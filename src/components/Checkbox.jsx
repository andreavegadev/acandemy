import React from 'react';
import styles from './Checkbox.module.css';

export const Checkbox = ({
  label,
  description,
  detail,
  checked,
  onChange,
  value,
  name,
  forceCompact = false,
}) => {
  const classNames = [
    styles.checkboxOption,
    checked ? styles.checked : '',
    forceCompact ? styles.compact : styles.row,
  ].join(' ');

  return (
    <label className={classNames}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.checkboxInput}
      />
      <div className={styles.content}>
        <div className={styles.labelGroup}>
          <div className={styles.label}>{label}</div>
          {description && <div className={styles.description}>{description}</div>}
        </div>
        {detail && <div className={styles.detail}>{detail}</div>}
      </div>
    </label>
  );
};

export const CheckboxGroup = ({
  options,
  name,
  selectedValues = [],
  onChange,
  forceCompact = false,
}) => {
  const handleChange = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <fieldset className={styles.checkboxGroup}>
      {options.map((option, index) => (
        <Checkbox
          key={index}
          label={option.label}
          description={option.description}
          detail={option.detail}
          value={option.value}
          name={name}
          checked={selectedValues.includes(option.value)}
          onChange={() => handleChange(option.value)}
          forceCompact={forceCompact}
        />
      ))}
    </fieldset>
  );
};
