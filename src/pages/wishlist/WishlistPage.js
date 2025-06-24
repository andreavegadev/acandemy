import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../utils/wishlist";
import { getProductById } from "../../api/products";
import ProductCard from "../../components/ProductCard";

const WishlistPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const wishlist = getWishlist().filter((id) => id);
    Promise.all(wishlist.map((id) => getProductById(id))).then(setProducts);
  }, []);

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    setProducts(products.filter((p) => p.id !== productId));
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2 style={{ color: "#5e35b1" }}>Mi Wishlist</h2>
      {products.length === 0 ? (
        <div style={{ color: "#888" }}>No tienes productos en tu wishlist.</div>
      ) : (
        <div className="product-cards">
          {products
            .filter((product) => product)
            .map((product) => (
              <div key={product.id} style={{ position: "relative", marginBottom: 24 }}>
                <ProductCard
                  id={product.id}
                  title={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.photo_url}
                  linkDetails={`/product/${encodeURIComponent(product.name)}`}
                />
                <button
                  onClick={() => handleRemove(product.id)}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "#ede7f6",
                    color: "#5e35b1",
                    border: "1px solid #d1c4e9",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                >
                  Quitar
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
