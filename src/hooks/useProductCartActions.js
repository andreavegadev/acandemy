import { useCart } from "../context/CartContext";

const useProductCardActions = ({ setToastMessage, setShowToast }) => {
  const { cart, addToCart } = useCart();

  const getProductQuantityInCart = (product) => {
    return cart.find((item) => item.cartLineId === product.id)?.quantity || 0;
  };

  const isProductOutOfStockOrMaxedInCart = (product) => {
    const inCartQty = getProductQuantityInCart(product);
    return product.stock === 0 || inCartQty >= product.stock;
  };

  const handleAddToCart = (product) => {
    const inCartQty = getProductQuantityInCart(product);

    if (product.stock === 0) {
      setToastMessage(`Lo sentimos, ${product.name} está agotado.`);
      setShowToast(true);
      return;
    }

    if (inCartQty >= product.stock) {
      setToastMessage(
        `Ya tienes ${product.stock} unidad${product.stock > 1 ? "es" : ""} de ${
          product.name
        } en el carrito. No puedes añadir más.`
      );
      setShowToast(true);
      return;
    }

    // If everything's okay, add to cart and show confirmation
    addToCart({ ...product, quantity: 1 });
    setToastMessage(`${product.name} se añadió al carrito.`);
    setShowToast(true);
  };

  return {
    getProductQuantityInCart,
    isProductOutOfStockOrMaxedInCart,
    handleAddToCart,
  };
};

export default useProductCardActions;
