import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FeaturedCard from "../components/FeaturedCard";
import ProductCard from "../components/ProductCard";
import ValueCard from "../components/ValueCard";
import "../styles/Common.css"; // Asegúrate de tener un archivo CSS para estilos

const HomePage = () => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
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
