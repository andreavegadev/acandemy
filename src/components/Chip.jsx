import styles from "./Chip.module.css";

const Chip = ({ label, active, "aria-label": ariaLabel, onClick }) => {
  const chipStyles = `${styles.container} ${active ? styles.active : ""}`;
  return (
    <button className={chipStyles} onClick={onClick} aria-label={ariaLabel}>
      {label}
    </button>
  );
};

export default Chip;
