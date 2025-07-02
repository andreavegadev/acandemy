import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FeaturedCard from "../components/FeaturedCard";
import ProductCard from "../components/ProductCard";
import ValueCard from "../components/ValueCard";
import "../styles/Common.css";

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

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="home-page">
      <section className="featured-section">
        <h2>Destacados</h2>
        <div className="featured-cards">
          {featuredCategories.map((category, index) => (
            <FeaturedCard
              key={index}
              icon={category.icon}
              title={category.title}
              description={category.description}
              link={category.link}
            />
          ))}
        </div>
      </section>

      <section className="categories-products-section">
        {categoriesWithProducts.map((cat) =>
          cat.products && cat.products.length > 0 ? (
            <div key={cat.id} style={{ marginBottom: 32 }}>
              <h2 style={{ color: "#5e35b1", marginBottom: 12 }}>{cat.name}</h2>
              <div
                className="product-cards"
                style={{ display: "flex", gap: 18, flexWrap: "wrap" }}
              >
                {cat.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.photo_url}
                    linkDetails={`/product/${encodeURIComponent(product.name)}`}
                  />
                ))}
              </div>
            </div>
          ) : null
        )}
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
  );
};

export default HomePage;
