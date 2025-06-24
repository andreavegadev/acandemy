import { useEffect, useState } from "react";

export default function useWishlistSync() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onChange = (e) => {
      if (!e.key || e.key === "wishlist") setTick((tick) => tick + 1);
    };
    window.addEventListener("storage", onChange);
    window.addEventListener("wishlistChanged", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("wishlistChanged", onChange);
    };
  }, []);

  return tick;
}
