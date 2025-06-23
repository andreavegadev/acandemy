import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../context/CartContext";
import "../../styles/ProductDetail.css"; // Import your CSS file for styling

const ProductDetailPage = () => {
  const { name } = useParams(); // Extract product name from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("id, name, description, price, photo_url, stock, handmade")
          .eq("name", name) // Search by product name
          .single();

        if (productError) {
          console.error("Error fetching product:", productError.message);
        } else {
          setProduct(productData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [name]);

  const handleChange = (e) => {
    const value = Math.max(1, Math.min(product.stock, Number(e.target.value)));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, price: Number(product.price), quantity });
  };

  if (loading) {
    return <p>Cargando detalles del producto...</p>;
  }

  if (!product) {
    return <p>No se encontró el producto.</p>;
  }

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <div className="product-detail-container">
        <img
          src={product.photo_url || "/path/to/default-image.jpg"}
          alt={product.name}
          className="product-detail-image"
        />
        <div className="product-detail-info">
          <p>
            <strong>Descripción:</strong> {product.description}
          </p>
          <p>
            <strong>Precio:</strong> €{product.price.toFixed(2)}
          </p>
          <p>
            <strong>Stock disponible:</strong> {product.stock}
          </p>
          <p>
            <strong>Hecho a mano:</strong> {product.handmade ? "Sí" : "No"}
          </p>
          <div>
            <label htmlFor="quantity">Cantidad:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleChange}
            />
            <span> (Stock disponible: {product.stock})</span>
          </div>
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
