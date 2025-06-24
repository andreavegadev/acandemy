import React, { useState, useEffect } from "react";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "../utils/wishlist";
import useWishlistSync from "../hooks/useWishlistSync";

const WishlistButton = ({ productId, size = 24 }) => {
  const tick = useWishlistSync();
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    setInWishlist(isInWishlist(productId));
  }, [productId, tick]);

  useEffect(() => {}, [productId]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(productId);
      setInWishlist(false);
    } else {
      addToWishlist(productId);
      setInWishlist(true);
    }
    // Notifica a otros tabs/ventanas
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      onClick={handleClick}
      aria-label={inWishlist ? "Quitar de wishlist" : "Añadir a wishlist"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        marginLeft: 8,
        verticalAlign: "middle",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={inWishlist ? "#e53935" : "none"}
        stroke="#e53935"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "fill 0.2s" }}
      >
        <path d="M12 21s-6.2-5.2-8.5-8C1.7 10.1 2.5 7 5 5.5 7.1 4.3 9.6 5.1 12 7.1c2.4-2 4.9-2.8 7-1.6C21.5 7 22.3 10.1 20.5 13c-2.3 2.8-8.5 8-8.5 8z" />
      </svg>
    </button>
  );
};

export default WishlistButton;
