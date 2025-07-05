import styles from "./Heading.module.css";
const Heading = ({ as: Tag = "h1", size, children, id }) => {
  const pxToRem = (px) => {
    return `${px / 16}rem`;
  };

  return (
    <Tag id={id} className={styles.heading} style={{ fontSize: size ?? pxToRem(size) }}>
      {children}
    </Tag>
  );
};
export default Heading;
