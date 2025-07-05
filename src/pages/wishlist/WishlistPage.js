import { useEffect, useState } from "react";
import { getWishlist } from "../../utils/wishlist";
import { getProductById } from "../../api/products";
import ProductCard from "../../components/ProductCard";
import useWishlistSync from "../../hooks/useWishlistSync";

const WishlistPage = () => {
  const [products, setProducts] = useState([]);
  const tick = useWishlistSync(); // Se actualiza cuando cambia la wishlist

  useEffect(() => {
    const wishlist = getWishlist().filter((id) => id);
    Promise.all(wishlist.map((id) => getProductById(id))).then(setProducts);
  }, [tick]); // <-- Se vuelve a cargar cuando cambia la wishlist

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
              <div
                key={product.id}
                style={{ position: "relative", marginBottom: 24 }}
              >
                <ProductCard
                  id={product.id}
                  title={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.photo_url}
                  linkDetails={`/product/${encodeURIComponent(product.name)}`}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
