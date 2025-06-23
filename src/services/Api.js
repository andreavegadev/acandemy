// src/services/api.js
import axios from "axios";

// Obtener productos
export const getProducts = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

// Obtener detalles de un producto
export const getProductById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/products/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product", error);
  }
};
