import styles from "./WishlistPage.module.css";
import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../utils/wishlist";
import { getProductById } from "../../api/products";
import ProductCard from "../../components/ProductCard";
import useWishlistSync from "../../hooks/useWishlistSync";
import Heading from "../../components/Heading";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import { Box, Stack } from "../../components/LayoutUtilities";
import useProductCardActions from "../../hooks/useProductCartActions";
import Toast from "../../components/Toast";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import Tag from "../../components/Tag";

const WishlistPage = () => {
  const [products, setProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const tick = useWishlistSync();

  useEffect(() => {
    const wishlist = getWishlist().filter((id) => id);
    Promise.all(wishlist.map((id) => getProductById(id))).then(setProducts);
  }, [tick]);

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const {
    getProductQuantityInCart,
    isProductOutOfStockOrMaxedInCart,
    handleAddToCart,
  } = useProductCardActions({
    setToastMessage,
    setShowToast,
  });

  const renderPrimaryAction = (product) => {
    const disabled = isProductOutOfStockOrMaxedInCart(product);

    if (product.order_customized) {
      return (
        <ButtonPrimary
          small
          disabled={disabled}
          onClick={() =>
            (window.location.href = `/product/${encodeURIComponent(
              product.name
            )}`)
          }
          aria-label={`Personalizar ${product.name}`}
        >
          Personalizar
        </ButtonPrimary>
      );
    }

    return (
      <ButtonPrimary
        small
        disabled={disabled}
        onClick={() => handleAddToCart(product)}
        aria-label={`Añadir ${product.name} al carrito`}
      >
        Añadir al Carrito
      </ButtonPrimary>
    );
  };

  const renderRemoveButton = (product) => (
    <ButtonSecondary
      small
      onClick={() => {
        removeFromWishlist(product.id);
        tick(); // refresh wishlist
        showToastMessage(`${product.name} fue eliminado de tus favoritos.`);
      }}
      aria-label={`Quitar ${product.name} de favoritos`}
    >
      Quitar de Favoritos
    </ButtonSecondary>
  );

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Stack gap={32}>
          <Heading>Favoritos</Heading>
          <div className={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  tag={
                    product.stock === 0 ||
                    getProductQuantityInCart(product) === product.stock ? (
                      <Tag type="warning">Agotado</Tag>
                    ) : null
                  }
                  title={product.name}
                  description={product.description}
                  price={product.price}
                  customized={product.order_customized}
                  image={product.product_images[0]?.src}
                  stock={product.stock}
                  linkDetails={`/product/${encodeURIComponent(product.name)}`}
                  primaryAction={renderPrimaryAction(product)}
                  secondaryAction={renderRemoveButton(product)}
                />
              ))
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </div>

          {showToast && (
            <Toast
              message={toastMessage}
              onClose={() => setShowToast(false)}
              action={{
                label: "Ver carrito",
                href: "/cart",
              }}
            />
          )}
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
};

export default WishlistPage;
