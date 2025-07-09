import styles from "./Price.module.css";

const Price = ({ amount, currency = "€", size }) => {

  function pxToRem(px) {
    return `${px / 16}rem`;
  }

  return (
    <span className={styles.price} style={{ fontSize: size ? pxToRem(size) : "1.325rem" }}>
      {Number(amount).toFixed(2)}
      {currency}
    </span>
  );
};

export default Price;
