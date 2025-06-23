import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FeaturedCard from "../components/FeaturedCard";
import ProductCard from "../components/ProductCard";
import ValueCard from "../components/ValueCard";
import "../styles/Common.css"; // Asegúrate de tener un archivo CSS para estilos

const HomePage = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

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
          }))
        );
      }

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

      const { data: bestSellersData, error: bestSellersError } =
        await supabase.rpc("get_best_sellers", { limit: 5 }); // Llama a una función RPC en Supabase

      if (bestSellersError || bestSellersData.length === 0) {
        // Si no hay Best Sellers, obtener los primeros 5 productos
        const { data: fallbackProducts, error: fallbackError } = await supabase
          .from("products")
          .select("id, name, price")
          .order("id", { ascending: true })
          .limit(5);

        if (fallbackError) {
          console.error(
            "Error al obtener los productos:",
            fallbackError.message
          );
        } else {
          setBestSellers(
            fallbackProducts.map((product) => ({
              title: product.name,
              price: `$${product.price.toFixed(2)}`,
              linkDetails: `/product/${encodeURIComponent(product.name)}`,
              linkBuy: `/cart/add/${encodeURIComponent(product.name)}`,
            }))
          );
        }
      } else {
        setBestSellers(
          bestSellersData.map((product) => ({
            title: product.name,
            price: `$${product.price.toFixed(2)}`,
            linkDetails: `/product/${product.id}`,
            linkBuy: `/cart/add/${product.id}`,
          }))
        );
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

      <section className="best-sellers-section">
        <h2>Best Sellers</h2>
        <div className="best-sellers-cards">
          {bestSellers.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              price={product.price}
              linkDetails={product.linkDetails}
              linkBuy={product.linkBuy}
            />
          ))}
        </div>
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
