import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  ButtonDanger,
  ButtonLinkDanger,
  ButtonPrimary,
} from "../components/Button";
import "../styles/CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // Calcula el total sumando producto base y personalizaciones
  const getTotal = () => {
    return cart.reduce((acc, item) => {
      let itemTotal = Number(item.price) || 0;
      if (item.personalizations && Array.isArray(item.personalizations)) {
        item.personalizations.forEach((p) => {
          if (p && p.additional_price) {
            itemTotal += Number(p.additional_price);
          }
        });
      }
      return acc + itemTotal * (item.quantity || 1);
    }, 0);
  };

  return (
    <div className="cart-page">
      <h1>Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.cartLineId || item.id} className="cart-item">
                <img
                  src={item.image || item.photo_url}
                  alt={item.title || item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.title || item.name}</h3>
                  <p>
                    Precio unitario:{" "}
                    {(() => {
                      let base = Number(item.price) || 0;
                      if (
                        item.personalizations &&
                        Array.isArray(item.personalizations)
                      ) {
                        item.personalizations.forEach((p) => {
                          if (p && p.additional_price) {
                            base += Number(p.additional_price);
                          }
                        });
                      }
                      return base.toFixed(2);
                    })()}{" "}
                    €
                  </p>
                  {item.personalizations &&
                    item.personalizations.length > 0 && (
                      <div className="cart-item-personalizations">
                        <strong>Personalizaciones:</strong>
                        <ul>
                          {item.personalizations.map((p, idx) => (
                            <li key={idx}>
                              {p.type ? <b>{p.type}:</b> : null} {p.name}
                              {p.additional_price > 0
                                ? ` (+${Number(p.additional_price).toFixed(
                                    2
                                  )}€)`
                                : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${item.id}`}>Cantidad:</label>
                    <input
                      type="number"
                      id={`quantity-${item.cartLineId}`}
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        updateQuantity(
                          item.cartLineId,
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </div>
                  <ButtonLinkDanger
                    small
                    bleedLeft
                    onClick={() => removeFromCart(item.cartLineId)}
                  >
                    Eliminar
                  </ButtonLinkDanger>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h2>Total: €{getTotal().toFixed(2)}</h2>
            <ButtonDanger onClick={clearCart} aria-label={`Vaciar carrito`}>
              Vaciar Carrito
            </ButtonDanger>
            <ButtonPrimary href={`/checkout`}>Resumen del pedido</ButtonPrimary>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
