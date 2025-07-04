import React from "react";
import "../../styles/LegalPages.css";

const PrivacyPolicyPage = () => {
  return (
    <div className="legal-bg">
      <div className="legal-card">
        <h1>Política de Privacidad</h1>
        <p>
          En cumplimiento del Reglamento General de Protección de Datos (RGPD) y
          la Ley Orgánica de Protección de Datos y Garantía de los Derechos
          Digitales (LOPDGDD), te informamos sobre cómo recopilamos, utilizamos
          y protegemos tus datos personales.
        </p>
        <h2>Responsable del Tratamiento</h2>
        <p>
          <strong>Nombre:</strong> Acandemy
          <br />
          <strong>Correo Electrónico:</strong>{" "}
          <a href="mailto:aa@gmail.com">aa@gmail.com</a>
          <br />
          <strong>Teléfono:</strong>{" "}
          <a href="tel:+34123456789">+34 123 456 789</a>
        </p>
        <h2>Datos Recopilados</h2>
        <ul>
          <li>Nombre y apellidos</li>
          <li>Correo electrónico</li>
          <li>Teléfono</li>
          <li>Dirección</li>
        </ul>
        <h2>Finalidad del Tratamiento</h2>
        <ul>
          <li>Responder a tus consultas</li>
          <li>Gestionar pedidos y servicios</li>
          <li>
            Enviar comunicaciones comerciales (si has dado tu consentimiento)
          </li>
        </ul>
        <h2>Tus Derechos</h2>
        <p>
          Tienes derecho a acceder, rectificar, eliminar y oponerte al
          tratamiento de tus datos personales. Para ejercer estos derechos,
          contacta con nosotros a través del correo electrónico proporcionado.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
