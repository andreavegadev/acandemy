import styles from "./Heading.module.css";
const Heading = ({ as: Tag = "h1", size, children, id, className }) => {
  const pxToRem = (px) => {
    return `${px / 16}rem`;
  };

  const headingStyles = `${styles.heading} ${className || ""}`;

  return (
    <Tag
      id={id}
      className={headingStyles}
      style={{ fontSize: size ?? pxToRem(size) }}
    >
      {children}
    </Tag>
  );
};
export default Heading;
