export function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

export function addToWishlist(productId) {
  console.log("Adding to wishlist:", productId);
  const id = String(productId);
  if (!id || id === "null" || id === "undefined") return;
  const wishlist = getWishlist();
  if (!wishlist.includes(id)) {
    wishlist.push(id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
}

export function removeFromWishlist(productId) {
  const id = String(productId);
  const wishlist = getWishlist().filter((pid) => pid !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

export function isInWishlist(productId) {
  const id = String(productId);
  return getWishlist().includes(id);
}
