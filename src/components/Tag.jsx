import styles from "./Tag.module.css";

const Tag = ({ children, type }) => {
  const tagType = {
    default: styles.default,
    info: styles.info,
    success: styles.success,
    danger: styles.danger,
    warning: styles.warning,
  };

  const tagStyles = `${styles.container} ${tagType[type]}`;
  return <span className={tagStyles}>{children}</span>;
};

export default Tag;
