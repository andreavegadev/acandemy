import styles from "./AsideLayout.module.css";

const AsideLayout = ({ aside, children }) => {

  const containerStyles = `${styles.container} ${aside ? styles.withAside : ""}`;
  return (
    <div className={containerStyles}>
      <div className={styles.content}>{children}</div>
      {aside && <aside className={styles.aside}>{aside}</aside>}
    </div>
  );
};
export default AsideLayout;
