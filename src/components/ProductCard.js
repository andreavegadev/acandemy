import React from "react";
import PropTypes from "prop-types";
import "../styles/Products.css";
import { useCart } from "../context/CartContext";
import WishlistButton from "../components/WishlistButton";

const ProductCard = ({ id, title, description, price, image, linkDetails }) => {
  const { addToCart } = useCart(); // Obtén la función para añadir productos al carrito

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      price: Number(price),
      image,
      quantity: 1,
    });
  };

  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3>{title}</h3>
        <WishlistButton productId={id} />
      </div>
      <p>{description}</p>
      <p className="product-price">{price}</p>
      <div className="product-actions">
        <a href={linkDetails} className="details-button">
          Ver Detalles
        </a>
        <button onClick={handleAddToCart} className="add-to-cart-button">
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string,
  linkDetails: PropTypes.string.isRequired,
};

export default ProductCard;
