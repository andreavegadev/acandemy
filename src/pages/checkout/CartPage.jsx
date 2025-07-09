import styles from "./CartPage.module.css";
import React, { useState, useEffect, useId } from "react";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../context/CartContext";
import useProductCardActions from "../../hooks/useProductCartActions";
import {
  ButtonLinkDanger,
  ButtonPrimary,
  IconButton,
} from "../../components/Button";
import Heading from "../../components/Heading";
import { Box, Inline, Stack } from "../../components/LayoutUtilities";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import Price from "../../components/Price";
import AsideLayout from "../../components/AsideLayout";
import { Counter } from "../../components/Counter";
import Text from "../../components/Text";
import ProductCard from "../../components/ProductCard";
import Carousel from "../../components/Carousel";
import Toast from "../../components/Toast";
import Tag from "../../components/Tag";

const CartItem = ({ item, removeFromCart, updateQuantity }) => {
  return (
    <li key={item.cartLineId || item.id} className={styles.cartItem}>
      <img
        src={
          item.product_images?.[0]?.src || item.image?.[0]?.src || item.image
        }
        alt={item.title || item.name}
        className={styles.cartItemImage}
      />
      <div className={styles.cartItemDetails}>
        <Inline gap={8} justify="space-between" fullWidth>
          <a
            href={`/product/${encodeURIComponent(item.title || item.name)}`}
            className={styles.cartItemHeadingLink}
          >
            <Heading as="h3">{item.title || item.name}</Heading>
          </a>

          <span>
            <Price
              size={16}
              amount={(() => {
                let base = Number(item.price) || 0;
                if (
                  item.personalizations &&
                  Array.isArray(item.personalizations)
                ) {
                  item.personalizations.forEach((p) => {
                    if (p && p.additional_price) {
                      base += Number(p.additional_price);
                    }
                  });
                }
                return base;
              })()}
            />
          </span>
        </Inline>
        {item.short_description && (
          <p className={styles.cartItemDescription}>{item.short_description}</p>
        )}
        {item.personalizations && item.personalizations.length > 0 && (
          <Stack gap={8}>
            <Heading as="h4" className={styles.personalizationsTitle}>
              Personalizaciones
            </Heading>
            <ul className={styles.personalizationsList}>
              {item.personalizations.map((p, idx) => (
                <li key={idx}>
                  <Inline gap={4} justify="space-between" fullWidth>
                    {p.type ? <b>{p.type}:</b> : null} {p.name}
                    {p.additional_price > 0 ? (
                      <span>
                        {"+"}
                        <Price amount={p.additional_price} size={14} />
                      </span>
                    ) : (
                      ""
                    )}
                  </Inline>
                </li>
              ))}
            </ul>
          </Stack>
        )}
        <Inline gap={8} justify="space-between" fullWidth>
          <Counter
            id={`quantity-${item.cartLineId}`}
            name="quantity"
            value={item.quantity}
            onChange={(newQty) => updateQuantity(item.cartLineId, newQty)}
            min={1}
            max={item.stock} // Use stock if available, otherwise a high number
          />

          <IconButton onClick={() => removeFromCart(item.cartLineId)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="inherit"
            >
              <g data-name="Layer 2">
                <g data-name="trash">
                  <rect width="24" height="24" opacity="0"></rect>
                  <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z"></path>
                </g>
              </g>
            </svg>
          </IconButton>
        </Inline>
      </div>
    </li>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const relatedProductsHeadingId = useId();

const {
  getProductQuantityInCart,
  isProductOutOfStockOrMaxedInCart,
  handleAddToCart,
} = useProductCardActions({
  setToastMessage,
  setShowToast,
});
  // Calcula el total sumando producto base y personalizaciones
  const getTotal = () => {
    return cart.reduce((acc, item) => {
      let itemTotal = Number(item.price) || 0;
      if (item.personalizations && Array.isArray(item.personalizations)) {
        item.personalizations.forEach((p) => {
          if (p && p.additional_price) {
            itemTotal += Number(p.additional_price);
          }
        });
      }
      return acc + itemTotal * (item.quantity || 1);
    }, 0);
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!cart || cart.length === 0) {
        setRelatedProducts([]);
        return;
      }

      // Get unique category IDs from cart items
      const categoryIds = [
        ...new Set(
          cart
            .map((item) => item.category_id)
            .filter((id) => id !== null && id !== undefined)
        ),
      ];

      // Get product IDs already in the cart to exclude them
      const cartProductIds = cart.map((item) => item.id).filter(Boolean);

      if (categoryIds.length === 0) {
        setRelatedProducts([]);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("category_id", categoryIds) // Filter by category IDs
        .not("id", "in", `(${cartProductIds.join(",")})`) // Exclude cart products
        .limit(6);

      if (error) {
        console.error("Error fetching related products:", error.message);
        setRelatedProducts([]);
      } else {
        setRelatedProducts(data);
      }
    };

    fetchRelatedProducts();
  }, [cart]);

  return (
    <ResponsiveLayout contentWidth={cart.length === 0 ? "narrow" : "wide"}>
      <Box paddingY={48}>
        <Stack gap={24}>
          <AsideLayout
            aside={
              cart.length > 0 && (
                <Stack gap={16}>
                  <Heading as="h2">Resumen del pedido</Heading>
                  <Inline gap={8} justify="space-between" fullWidth>
                    <Text size={20}>Total</Text>
                    <Price amount={getTotal()} />
                  </Inline>
                  <ButtonPrimary
                    href={`/checkout`}
                    fullWidth
                    forceDesktopFullWidth
                  >
                    Continuar con la compra
                  </ButtonPrimary>
                </Stack>
              )
            }
          >
            <Stack gap={24}>
              {cart.length === 0 && <Text size={64}>🛒</Text>}
              <Heading>
                {cart.length === 0
                  ? "Tu carrito de la compra está vacío"
                  : "Carrito de la compra"}
              </Heading>
              {cart.length === 0 ? (
                <>
                  <Text size={18}>
                    Cuando añadas productos a tu carrito de la compra,
                    aparecerán aquí.
                  </Text>
                </>
              ) : (
                <Stack gap={16}>
                  <Heading as="h2">Productos ({cart.length})</Heading>
                  <ul className={styles.cartList}>
                    {cart.map((item) => {
                      return (
                        <CartItem
                          key={item.cartLineId || item.id}
                          item={item}
                          removeFromCart={removeFromCart}
                          updateQuantity={updateQuantity}
                        />
                      );
                    })}
                  </ul>
                  <ButtonLinkDanger
                    onClick={clearCart}
                    aria-label={`Vaciar carrito`}
                    bleedLeft
                  >
                    Vaciar Carrito
                  </ButtonLinkDanger>
                </Stack>
              )}
            </Stack>
          </AsideLayout>
          {relatedProducts.length > 0 && (
            <section>
              <Stack gap={16}>
                <Heading as="h2" id={relatedProductsHeadingId}>
                  También te puede interesar
                </Heading>
                <Carousel aria-labelledby={relatedProductsHeadingId}>
                  {relatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.name}
                      description={product.description}
                      price={product.price}
                      image={product.product_images[0]?.src}
                      stock={product.stock}
                      customized={product.order_customized}
                      tag={
                        product.stock === 0 ||
                        getProductQuantityInCart(product) === product.stock ? (
                          <Tag type="warning">Agotado</Tag>
                        ) : null
                      }
                      primaryAction={
                        isProductOutOfStockOrMaxedInCart(product) ? (
                          <ButtonPrimary
                            small
                            disabled
                            aria-label={`Añadir ${product.name} al carrito`}
                          >
                            Agotado
                          </ButtonPrimary>
                        ) : (
                          <ButtonPrimary
                            small
                            onClick={() => handleAddToCart(product)}
                            aria-label={`Añadir ${product.name} al carrito`}
                          >
                            Añadir al Carrito
                          </ButtonPrimary>
                        )
                      }
                      linkDetails={`/product/${encodeURIComponent(
                        product.name
                      )}`}
                      category={product.category_id}
                    />
                  ))}
                </Carousel>
              </Stack>
            </section>
          )}
        </Stack>
      </Box>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          action={{ label: "Ver carrito", href: "/cart" }}
        />
      )}
    </ResponsiveLayout>
  );
};

export default CartPage;
