import Heading from "./Heading";
import Text from "./Text";
import styles from "./ValueCard.module.css";

const ValueCard = ({ asset, title, subtitle }) => {
  return (
    <div className={styles.valueCard}>
      <div className={styles.assetContainer}>{asset && asset}</div>
      <Heading as="h3" size={24}>
        {title}
      </Heading>
      <Text color="var(--text-secondary)" className={styles.subtitle}>
        {subtitle}
      </Text>
    </div>
  );
};

export default ValueCard;
