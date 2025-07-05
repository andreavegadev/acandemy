import "../../styles/LegalPages.css";

const CookiesPolicyPage = () => {
  return (
    <div className="legal-bg">
      <div className="legal-card">
        <h1>Política de Cookies</h1>
        <p>
          Este sitio web utiliza cookies para mejorar la experiencia del
          usuario. Al continuar navegando, aceptas el uso de cookies de acuerdo
          con esta política.
        </p>
        <h2>¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu
          dispositivo cuando visitas un sitio web. Se utilizan para recordar tus
          preferencias y mejorar tu experiencia de navegación.
        </p>
        <h2>Tipos de Cookies Utilizadas</h2>
        <ul>
          <li>
            <strong>Cookies técnicas:</strong> Necesarias para el funcionamiento
            del sitio web.
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
        <h2>Cómo Gestionar las Cookies</h2>
        <p>
          Puedes configurar tu navegador para aceptar, bloquear o eliminar
          cookies. Consulta la sección de ayuda de tu navegador para obtener más
          información.
        </p>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
