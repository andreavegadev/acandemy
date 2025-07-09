import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ValueCard from "../components/ValueCard";
import { ButtonLink } from "../components/Button";
import Heading from "../components/Heading";
import ResponsiveLayout from "../components/ResponsiveLayout";
import { Box } from "../components/LayoutUtilities";

const AboutPage = () => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    const fetchValues = async () => {
      const { data: valuesData, error: valuesError } = await supabase
        .from("values")
        .select("id, title, description, icon");

      if (valuesError) {
        console.error("Error al obtener los valores:", valuesError.message);
      } else {
        setValues(valuesData);
      }
    };

    fetchValues();
  }, []);

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Heading>Sobre Nosotros</Heading>
        <p>
          En <strong>Acandemy</strong>, nos apasionan las mascotas y creemos que
          merecen lo mejor. Nuestra misión es proporcionar productos de alta
          calidad y servicios excepcionales para garantizar el bienestar de tus
          amigos peludos.
        </p>

        <div className="about-section">
          <Heading as="h2">🌟 Nuestra Historia</Heading>
          <p>
            Acandemy nació en Gijón con el objetivo de crear un espacio donde
            los amantes de las mascotas puedan encontrar todo lo que necesitan
            en un solo lugar. Desde entonces, hemos trabajado arduamente para
            convertirnos en una referencia en el cuidado de mascotas.
          </p>
        </div>

        <div className="about-section">
          <Heading as="h2">🐾 Nuestros Valores</Heading>
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
          <Heading as="h2">🤝 Nuestro Compromiso</Heading>
          <p>
            Nos esforzamos por brindar una experiencia excepcional a nuestros
            clientes, desde la selección de productos hasta el servicio al
            cliente. Tu satisfacción es nuestra prioridad.
          </p>
        </div>

        <div className="about-section">
          <Heading as="h2">📞 Contáctanos</Heading>
          <p>
            Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en
            contacto con nosotros a través de nuestra página de{" "}
            <ButtonLink
              href={`/contact`}
              aria-label={`Ir a la página de contacto`}
            >
              Contacto
            </ButtonLink>
            .
          </p>
        </div>
      </Box>
    </ResponsiveLayout>
  );
};

export default AboutPage;
