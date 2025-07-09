import styles from "./ResponsiveLayout.module.css";

const ResponsiveLayout = ({ children, contentWidth }) => {
  const containerStyle = `${styles.container} ${
    contentWidth === "narrow" ? styles.narrow : ""
  }`;
  return <div className={containerStyle}>{children}</div>;
};

export default ResponsiveLayout;
