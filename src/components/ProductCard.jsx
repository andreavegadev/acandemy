import styles from "./ProductCard.module.css";
import { useCart } from "../context/CartContext";
import WishlistButton from "./WishlistButton";
import { ButtonLink, ButtonPrimary } from "./Button";
import Price from "./Price";

import { forwardRef } from "react";
const ProductCard = forwardRef((props, ref) => {
  const {
    id,
    title,
    description,
    price,
    image,
    stock,
    linkDetails,
    className,
  } = props;
  const { addToCart } = useCart();

  const imageObj =
    typeof image === "string"
      ? {
          src: image,
          alt: title || "Imagen del producto",
          aspectRatio: "4/3",
        }
      : {
          src: image?.src || "https://picsum.photos/200/300",
          alt: image?.alt || title || "Imagen del producto",
          aspectRatio: image?.aspectRatio || "4/3",
        };

  const isTitleObj = typeof title === "object" && title !== null;
  const titleLabel = isTitleObj ? title.label : title;
  const titleLevel = isTitleObj ? title.level : "h3";

  const handleAddToCart = () => {
    addToCart({
      id,
      title: titleLabel,
      price: Number(price),
      image: imageObj,
      quantity: 1,
      stock,
      cartLineId: id,
    });
  };

  const TopActions = ({ id }) => {
    return (
      <div className={styles.topActions}>
        <WishlistButton productId={id} />
      </div>
    );
  };

  const CardTitle = ({ children, as: Tag = "h3" }) => {
    return <Tag className={styles.title}>{children}</Tag>;
  };

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
        <CardTitle as={titleLevel}>{titleLabel}</CardTitle>
        <p className={styles.description}>{description}</p>
        <Price amount={price} />
      </div>
      <div className={styles.buttonContainer}>
        <ButtonPrimary
          small
          onClick={handleAddToCart}
          aria-label={`Añadir ${title} al carrito`}
        >
          Añadir al Carrito
        </ButtonPrimary>
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
