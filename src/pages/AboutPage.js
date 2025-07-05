import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ValueCard from "../components/ValueCard";
import "../styles/AboutPage.css";

const AboutPage = () => {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValues = async () => {
      setLoading(true);

      const { data: valuesData, error: valuesError } = await supabase
        .from("values")
        .select("id, title, description, icon");

      if (valuesError) {
        console.error("Error al obtener los valores:", valuesError.message);
      } else {
        setValues(valuesData);
      }

      setLoading(false);
    };

    fetchValues();
  }, []);

  return (
    <div className="about-page">
      <h1>Sobre Nosotros</h1>
      <p>
        En <strong>Acandemy</strong>, nos apasionan las mascotas y creemos que
        merecen lo mejor. Nuestra misión es proporcionar productos de alta
        calidad y servicios excepcionales para garantizar el bienestar de tus
        amigos peludos.
      </p>

      <div className="about-section">
        <h2>🌟 Nuestra Historia</h2>
        <p>
          Acandemy nació en Gijón con el objetivo de crear un espacio donde los
          amantes de las mascotas puedan encontrar todo lo que necesitan en un
          solo lugar. Desde entonces, hemos trabajado arduamente para
          convertirnos en una referencia en el cuidado de mascotas.
        </p>
      </div>

      <div className="about-section">
        <h2>🐾 Nuestros Valores</h2>
        <div className="values-cards">
          {values.map((value) => (
            <ValueCard
              key={value.id}
              icon={value.icon}
              title={value.title}
              subtitle={value.description}
            />
          ))}
        </div>
      </div>

      <div className="about-section">
        <h2>🤝 Nuestro Compromiso</h2>
        <p>
          Nos esforzamos por brindar una experiencia excepcional a nuestros
          clientes, desde la selección de productos hasta el servicio al
          cliente. Tu satisfacción es nuestra prioridad.
        </p>
      </div>

      <div className="about-section">
        <h2>📞 Contáctanos</h2>
        <p>
          Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en
          contacto con nosotros a través de nuestra página de{" "}
          <a href="/contact">Contacto</a>.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
