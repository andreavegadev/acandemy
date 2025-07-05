import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
import { supabase } from "../supabaseClient";
import FeaturedCard from "../components/FeaturedCard";
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

const HomePage = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Categorías destacadas
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name, description, icon")
        .eq("featured", true);

      if (categoriesError) {
        console.error(
          "Error al obtener las categorías destacadas:",
          categoriesError.message
        );
      } else {
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
      }

      // Valores
      const { data: valuesData, error: valuesError } = await supabase
        .from("values")
        .select("id, title, description, icon");

      if (valuesError) {
        console.error("Error al obtener los valores:", valuesError.message);
      } else {
        setValues(
          valuesData.map((value) => ({
            icon: value.icon,
            title: value.title,
            subtitle: value.description,
          }))
        );
      }

      // Todas las categorías para la sección de productos por categoría
      const { data: allCategories, error: allCategoriesError } = await supabase
        .from("categories")
        .select("id, name");

      if (allCategoriesError) {
        console.error(
          "Error al obtener todas las categorías:",
          allCategoriesError.message
        );
        setCategoriesWithProducts([]);
      } else {
        // Para cada categoría, obtener los últimos 5 productos
        const categoriesWithProds = await Promise.all(
          allCategories.map(async (cat) => {
            const { data: products, error: productsError } = await supabase
              .from("products")
              .select("id, name, description, price, photo_url")
              .eq("category_id", cat.id)
              .order("created_at", { ascending: false })
              .limit(5);

            if (productsError) {
              return { ...cat, products: [] };
            }
            return { ...cat, products };
          })
        );
        setCategoriesWithProducts(categoriesWithProds);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const ProductCategories = ({ label, href, asset }) => {
    return (
      <a href={href} className={styles.categoryContainer}>
        <div className={styles.categoryIcon}>{asset} </div>
        <span className={styles.categoryLabel}>{label}</span>
      </a>
    );
  };

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <div className="home-page">
          <section className="featured-section">
            <HorizontalScroll className={styles.categoriesScroll}> 
              <Inline justify="center" gap={16} fullWidth>
                {featuredCategories.map((category, index) => (
                  <ProductCategories
                    key={index}
                    label={category.name}
                    href={category.link}
                    asset={category.icon}
                  />
                ))}
              </Inline>
            </HorizontalScroll>
          </section>

          <section className="categories-products-section">
            <Stack>
              {categoriesWithProducts.map((cat) =>
                cat.products && cat.products.length > 0 ? (
                  <div key={cat.id}>
                    <Heading>{cat.name}</Heading>
                    <Carousel>
                      {cat.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          title={product.name}
                          description={product.description}
                          price={product.price}
                          image={product.photo_url}
                          linkDetails={`/product/${encodeURIComponent(
                            product.name
                          )}`}
                        />
                      ))}
                    </Carousel>
                  </div>
                ) : null
              )}
            </Stack>
          </section>

          <section className="values-section">
            <h2>¿Por qué escoger Acandemy?</h2>
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
        </div>
      </Box>
    </ResponsiveLayout>
  );
};

export default HomePage;
