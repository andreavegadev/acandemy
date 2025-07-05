// src/context/CartContext.js
import { createContext, useState, useContext, useEffect } from "react";

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
    setCart((prevCart) => {
      const idx = prevCart.findIndex(
        (item) => item.cartLineId === product.cartLineId
      );
      const quantityToAdd = product.quantity || 1;
      const stock = product.stock || Infinity;

      // Suma la cantidad actual en el carrito para este cartLineId
      const currentQty = idx !== -1 ? prevCart[idx].quantity : 0;
      if (currentQty + quantityToAdd > stock) {
        alert("No puedes añadir más unidades, no hay suficiente stock.");
        return prevCart;
      }

      if (idx !== -1) {
        const updated = [...prevCart];
        updated[idx].quantity = currentQty + quantityToAdd;
        return updated;
      }

      return [...prevCart, { ...product, quantity: quantityToAdd }];
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

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
