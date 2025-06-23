import React from "react";
import "../../styles/LegalPages.css";

const LegalNoticePage = () => {
  return (
    <div className="legal-notice-page">
      <h1>Aviso Legal</h1>
      <p>
        En cumplimiento con el deber de información establecido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa de lo siguiente:
      </p>
      <h2>Datos del Responsable</h2>
      <p>
        <strong>Nombre:</strong> Acandemy<br />
        <strong>NIF:</strong> X12345678<br />
        <strong>Dirección:</strong> Calle de las Mascotas, 123, Gijón, España<br />
        <strong>Correo Electrónico:</strong> <a href="mailto:andreavegadev@gmail.com">andreavegadev@gmail.com</a><br />
        <strong>Teléfono:</strong> <a href="tel:+34123456789">+34 123 456 789</a>
      </p>
      <h2>Condiciones de Uso</h2>
      <p>
        El acceso y uso de este sitio web implica la aceptación de las condiciones de uso descritas en este aviso legal. El usuario se compromete a utilizar el sitio web de forma lícita y respetuosa.
      </p>
      <h2>Propiedad Intelectual</h2>
      <p>
        Todos los contenidos de este sitio web, incluidos textos, imágenes, gráficos y diseños, son propiedad de Acandemy o de sus licenciantes y están protegidos por las leyes de propiedad intelectual.
      </p>
    </div>
  );
};

export default LegalNoticePage;