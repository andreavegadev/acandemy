import Heading from "../../components/Heading";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import { Box } from "../../components/LayoutUtilities";

const CookiesPolicyPage = () => {
  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <div className="legal-card">
          <Heading>Política de Cookies</Heading>
          <p>
            Este sitio web utiliza cookies para mejorar la experiencia del
            usuario. Al continuar navegando, aceptas el uso de cookies de
            acuerdo con esta política.
          </p>
          <Heading as="h2">¿Qué son las cookies?</Heading>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu
            dispositivo cuando visitas un sitio web. Se utilizan para recordar
            tus preferencias y mejorar tu experiencia de navegación.
          </p>
          <Heading as="h2">Tipos de Cookies Utilizadas</Heading>
          <ul>
            <li>
              <strong>Cookies técnicas:</strong> Necesarias para el
              funcionamiento del sitio web.
            </li>
            <li>
              <strong>Cookies de análisis:</strong> Utilizadas para recopilar
              datos sobre el uso del sitio web.
            </li>
            <li>
              <strong>Cookies de terceros:</strong> Proporcionadas por servicios
              externos como Google Analytics.
            </li>
          </ul>
          <Heading as="h2">Cómo Gestionar las Cookies</Heading>
          <p>
            Puedes configurar tu navegador para aceptar, bloquear o eliminar
            cookies. Consulta la sección de ayuda de tu navegador para obtener
            más información.
          </p>
        </div>
      </Box>
    </ResponsiveLayout>
  );
};

export default CookiesPolicyPage;
