import styles from "./ProductCard.module.css";
import WishlistButton from "./WishlistButton";
import { ButtonLink } from "./Button";
import Price from "./Price";
import { forwardRef } from "react";
import Heading from "./Heading";

const ProductCard = forwardRef((props, ref) => {
  const {
    id,
    title,
    description,
    price,
    image,
    tag,
    linkDetails,
    className,
    primaryAction,
  } = props;

  // Mostrar solo las primeras 15 palabras de la descripción
  const shortDescription = description
    ? description.split(" ").slice(0, 15).join(" ") +
      (description.split(" ").length > 15 ? "..." : "")
    : "";

  const imageObj =
    typeof image === "string"
      ? {
          src: image[0]?.src || image,
          alt: title || "Imagen del producto",
          aspectRatio: "4/3",
        }
      : {
          src: image?.src,
          alt: image?.alt || title || "Imagen del producto",
          aspectRatio: image?.aspectRatio || "4/3",
        };

  const isTitleObj = typeof title === "object" && title !== null;
  const titleLabel = isTitleObj ? title.label : title;
  const titleLevel = isTitleObj ? title.level : "h3";

  const TopActions = ({ id }) => (
    <div className={styles.topActions}>
      <WishlistButton productId={id} />
    </div>
  );

  return (
    <div className={`${styles.container} ${className}`} ref={ref}>
      <TopActions id={id} />
      <div className={styles.content}>
        <img
          src={imageObj.src}
          alt={imageObj.alt}
          style={{ aspectRatio: imageObj.aspectRatio }}
          className={styles.image}
        />
        {tag && tag}
        <Heading as={titleLevel} size={22}>
          {titleLabel}
        </Heading>
        <p className={styles.description}>{shortDescription}</p>
        <Price amount={price} />
      </div>
      <div className={styles.buttonContainer}>
        {primaryAction && primaryAction}
        <ButtonLink
          small
          bleedLeft
          href={linkDetails}
          aria-label={`Ver detalles de ${title}`}
        >
          Ver Detalles
        </ButtonLink>
      </div>
    </div>
  );
});

export default ProductCard;
