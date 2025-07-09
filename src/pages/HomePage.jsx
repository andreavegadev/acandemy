import { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import { supabase } from "../supabaseClient";
import useProductCardActions from "../hooks/useProductCartActions";
import ProductCard from "../components/ProductCard";
import ValueCard from "../components/ValueCard";
import "../styles/Common.css";
import {
  Box,
  HorizontalScroll,
  Inline,
  Stack,
} from "../components/LayoutUtilities";
import ResponsiveLayout from "../components/ResponsiveLayout";
import Heading from "../components/Heading";
import Carousel from "../components/Carousel";
import Hero from "../components/Hero";
import Toast from "../components/Toast";
import { ButtonPrimary } from "../components/Button";
import Tag from "../components/Tag";

const HomePage = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [values, setValues] = useState([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const {
    getProductQuantityInCart,
    isProductOutOfStockOrMaxedInCart,
    handleAddToCart,
  } = useProductCardActions({
    setToastMessage,
    setShowToast,
  });

  // 🔁 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("id, name, description, icon")
          .eq("featured", true);

        if (categoriesError) throw categoriesError;

        setFeaturedCategories(
          categoriesData.map((category) => ({
            icon: category.icon,
            title: category.name,
            description: category.description,
            link: `/products/${encodeURIComponent(category.name)}`,
            id: category.id,
            name: category.name,
          }))
        );

        // Fetch values
        const { data: valuesData, error: valuesError } = await supabase
          .from("values")
          .select("id, title, description, icon");

        if (valuesError) throw valuesError;

        setValues(
          valuesData.map((value) => ({
            icon: value.icon,
            title: value.title,
            subtitle: value.description,
          }))
        );

        // Fetch all categories
        const { data: allCategories, error: allCategoriesError } =
          await supabase.from("categories").select("id, name");

        if (allCategoriesError) throw allCategoriesError;

        const categoriesWithProds = await Promise.all(
          allCategories.map(async (cat) => {
            const { data: products, error: productsError } = await supabase
              .from("products")
              .select(
                "id, name, description, price, product_images, stock, order_customized, category_id"
              )
              .eq("category_id", cat.id)
              .order("created_at", { ascending: false })
              .limit(5);

            if (productsError) return { ...cat, products: [] };
            return { ...cat, products };
          })
        );

        setCategoriesWithProducts(categoriesWithProds);
      } catch (error) {
        console.error("Error loading homepage data:", error.message);
      }
    };

    fetchData();
  }, []);

  // 🧠 Render button based on product
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

  // 📦 UI
  return (
    <Box paddingY={48}>
      <div className="home-page">
        <ResponsiveLayout>
          <section className="featured-section">
            <HorizontalScroll className={styles.categoriesScroll}>
              <Inline justify="center" gap={16} fullWidth>
                {featuredCategories.map((category, index) => (
                  <a
                    key={index}
                    href={category.link}
                    className={styles.categoryContainer}
                  >
                    <div className={styles.categoryIcon}>{category.icon}</div>
                    <span className={styles.categoryLabel}>
                      {category.name}
                    </span>
                  </a>
                ))}
              </Inline>
            </HorizontalScroll>
          </section>
        </ResponsiveLayout>

        <section className="hero-section">
          <Hero />
        </section>

        <ResponsiveLayout>
          <section className="categories-products-section">
            <Stack gap={48}>
              {categoriesWithProducts.map((cat) => {
                if (!cat.products || cat.products.length === 0) return null;

                const headingId = `category-heading-${cat.id}`;

                return (
                  <div key={cat.id}>
                    <Stack gap={16}>
                      <Heading id={headingId} as="h2">
                        {cat.name}
                      </Heading>
                      <Carousel aria-labelledby={headingId}>
                        {cat.products.map((product) => (
                          <ProductCard
                            key={product.id}
                            id={product.id}
                            tag={
                              product.stock === 0 ||
                              getProductQuantityInCart(product) ===
                                product.stock ? (
                                <Tag type="warning">Agotado</Tag>
                              ) : null
                            }
                            title={product.name}
                            description={product.description}
                            price={product.price}
                            image={product.product_images[0]?.src}
                            stock={product.stock}
                            customized={product.order_customized}
                            primaryAction={renderPrimaryAction(product)}
                            linkDetails={`/product/${encodeURIComponent(
                              product.name
                            )}`}
                          />
                        ))}
                      </Carousel>
                    </Stack>
                  </div>
                );
              })}
            </Stack>
          </section>
        </ResponsiveLayout>

        <ResponsiveLayout>
          <section className="values-section">
            <Heading as="h2">¿Por qué escoger Acandemy?</Heading>
            <div className="values-cards">
              {values.map((value, index) => (
                <ValueCard
                  key={index}
                  icon={value.icon}
                  title={value.title}
                  subtitle={value.subtitle}
                />
              ))}
            </div>
          </section>

          {showToast && (
            <Toast
              message={toastMessage}
              action={{
                label: "Ver carrito",
                href: "/cart",
              }}
              onClose={() => setShowToast(false)}
            />
          )}
        </ResponsiveLayout>
      </div>
    </Box>
  );
};

export default HomePage;
