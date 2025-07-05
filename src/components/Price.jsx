import styles from "./Price.module.css";

const Price = ({ amount, currency = "€", className }) => {
  return (
    <span className={styles.price}>
      {Number(amount).toFixed(2)}
      {currency}
    </span>
  );
};

export default Price;
