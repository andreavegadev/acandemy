import styles from "./Chip.module.css";

const Chip = ({
  label,
  active,
  "aria-label": ariaLabel,
  onClick,
  href,
  asset,
}) => {
  const chipStyles = `${styles.container} ${active ? styles.active : ""}`;
  return href ? (
    <a className={chipStyles} href={href} aria-label={ariaLabel}>
      {asset && (
        <span className={styles.asset} aria-hidden="true">
          {asset}
        </span>
      )}
      {label}
    </a>
  ) : (
    <button className={chipStyles} onClick={onClick} aria-label={ariaLabel}>
      {asset && (
        <span className={styles.asset} aria-hidden="true">
          {asset}
        </span>
      )}
      {label}
    </button>
  );
};

export default Chip;
