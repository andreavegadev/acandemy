import styles from "./Badge.module.css";

const Badge = ({ count, children }) => {
  return (
    <>
      <div className={styles.container}>
        {count > 0 && <span className={styles.badge}>{count}</span>}
        {children}
      </div>
    </>
  );
};

export default Badge;
