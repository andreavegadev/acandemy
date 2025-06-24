import React from "react";
import PropTypes from "prop-types";
import "../styles/Products.css";
import { useCart } from "../context/CartContext"; // Importa el contexto del carrito

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
      <h3>{title}</h3>
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
  id: PropTypes.string.isRequired, // Asegúrate de que cada producto tenga un ID único
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired, // Cambiado a número para cálculos
  image: PropTypes.string,
  linkDetails: PropTypes.string.isRequired,
};

export default ProductCard;
