import { useEffect, useState } from "react";

export default function useWishlistSync() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "wishlist") setTick((tick) => tick + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return tick;
}
