import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h1>Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img
                  src={item.image || item.photo_url}
                  alt={item.title || item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.title || item.name}</h3>
                  <p>
                    Precio:{" "}
                    {isNaN(Number(item.price))
                      ? "0.00"
                      : Number(item.price).toFixed(2)}{" "}
                    €
                  </p>
                  <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${item.id}`}>Cantidad:</label>
                    <input
                      type="number"
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                    />
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h2>Total: €{getTotal().toFixed(2)}</h2>
            <button onClick={clearCart}>Vaciar Carrito</button>
            <button onClick={() => navigate("/checkout")}>
              Resumen del pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
