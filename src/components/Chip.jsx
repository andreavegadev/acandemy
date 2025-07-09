import styles from "./Chip.module.css";

const Chip = ({ label, active, "aria-label": ariaLabel, onClick, href }) => {
  const chipStyles = `${styles.container} ${active ? styles.active : ""}`;
  return (
    href ? (
      <a className={chipStyles} href={href} aria-label={ariaLabel}>
        {label}
      </a>
    ) : (
      <button className={chipStyles} onClick={onClick} aria-label={ariaLabel}>
        {label}
      </button>
    )
  );
};

export default Chip;
