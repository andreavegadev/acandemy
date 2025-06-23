// src/context/CartContext.js
import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Busca el producto por id
      const existingProduct = prevCart.find((item) => item.id === product.id);
      const quantityToAdd = product.quantity || 1;
      const stock = product.stock || Infinity;

      if (existingProduct) {
        // Si ya existe, suma la cantidad pero nunca más que el stock
        const newQuantity = existingProduct.quantity + quantityToAdd;
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQuantity > stock ? stock : newQuantity }
            : item
        );
      }
      // Si no existe, añade el producto con la cantidad indicada
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
