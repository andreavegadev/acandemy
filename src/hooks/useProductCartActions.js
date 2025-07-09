import { useCart } from "../context/CartContext";
import getCartLineId from "../utils/getCartLineId";

const useProductCardActions = ({ setToastMessage, setShowToast }) => {
  const { cart, addToCart } = useCart();

  const getProductQuantityInCart = (product) => {
    const cartLineId = getCartLineId(product, product.personalizations || []);
    return cart.find((item) => item.cartLineId === cartLineId)?.quantity || 0;
  };

  const isProductOutOfStockOrMaxedInCart = (product) => {
    const inCartQty = getProductQuantityInCart(product);
    return product.stock === 0 || inCartQty >= product.stock;
  };

  const handleAddToCart = (product) => {
    const cartLineId = getCartLineId(product, product.personalizations || []);
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
        } en el carrito.`
      );
      setShowToast(true);
      return;
    }

    addToCart({ ...product, cartLineId, quantity: 1 });
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
