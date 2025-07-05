import styles from "./Heading.module.css";
const Heading = ({ as: Tag = "h1", size = 24, children }) => {
  const pxToRem = (px) => {
    return `${px / 16}rem`;
  };

  return (
    <Tag className={styles.heading} style={{ fontSize: pxToRem(size) }}>
      {children}
    </Tag>
  );
};
export default Heading;
