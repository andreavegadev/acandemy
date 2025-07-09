import React from 'react';
import styles from './RadioButton.module.css';

export const RadioButton = ({
  label,
  description,
  detail,
  value,
  name,
  checked,
  onChange,
  forceCompact = false,
}) => {
  const classNames = [
    styles.radioOption,
    checked ? styles.checked : '',
    forceCompact ? styles.compact : styles.row,
  ].join(' ');

  return (
    <label className={classNames}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.radioInput}
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


export const RadioButtonGroup = ({ options, name, selectedValue, onChange, forceCompact = false }) => {
  return (
    <fieldset className={styles.radioGroup}>
      {options.map((option, index) => (
        <RadioButton
          key={index}
          label={option.label}
          description={option.description}
          detail={option.detail}
          value={option.value}
          name={name}
          checked={selectedValue === option.value}
          onChange={() => onChange(option.value)}
          forceCompact={forceCompact}
        />
      ))}
    </fieldset>
  );
};
