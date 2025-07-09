import styles from "./Text.module.css";

const Text = ({
  children,
  as: Component = "p",
  size,
  color = "var(--text-primary)",
}) => {
    function pxToRem(px) {
        return `${px / 16}rem`;
    }   
  return (
    <Component style={{ fontSize: pxToRem(size), color: color }} className={styles.text}>
      {children}
    </Component>
  );
};

export default Text;
