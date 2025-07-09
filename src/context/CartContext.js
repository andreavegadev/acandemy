// src/context/CartContext.js
import { createContext, useState, useContext, useEffect } from "react";
import getCartLineId from "../utils/getCartLineId";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Lee el carrito de localStorage al iniciar
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Guarda el carrito en localStorage cada vez que cambie
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Añadir al carrito usando cartLineId para distinguir producto+personalizaciones
  const addToCart = (product) => {
    const cartLineId =
      product.cartLineId ||
      getCartLineId(product, product.personalizations || []);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.cartLineId === cartLineId);
      if (existing) {
        return prevCart.map((item) =>
          item.cartLineId === cartLineId
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, cartLineId }];
      }
    });
  };

  // Eliminar usando cartLineId (no id)
  const removeFromCart = (cartLineId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartLineId !== cartLineId)
    );
  };

  // Actualizar cantidad usando cartLineId (no id)
  const updateQuantity = (cartLineId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartLineId === cartLineId) {
          const stock = Number(item.stock) || Infinity;
          // No permitir superar el stock ni bajar de 1
          let newQty = Math.max(1, Math.min(quantity, stock));
          if (quantity > stock) {
            alert("No puedes añadir más unidades, no hay suficiente stock.");
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Total sumando personalizaciones
  const getTotal = () => {
    return cart.reduce((total, item) => {
      let base = Number(item.price) || 0;
      if (item.personalizations && Array.isArray(item.personalizations)) {
        item.personalizations.forEach((p) => {
          if (p && p.additional_price) {
            base += Number(p.additional_price);
          }
        });
      }
      return total + base * (item.quantity || 1);
    }, 0);
  };
  const getProductQuantity = (product) => {
    const cartLineId = getCartLineId(product, product.personalizations || []);
    return cart.find((item) => item.cartLineId === cartLineId)?.quantity || 0;
  };
  const isProductMaxed = (product) => {
  const quantity = getProductQuantity(product);
  return product.stock > 0 && quantity === product.stock;
};

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getProductQuantity,
        isProductMaxed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
