import styles from "./ResponsiveLayout.module.css";

const ResponsiveLayout = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default ResponsiveLayout;