import Heading from "../../components/Heading";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import { Box } from "../../components/LayoutUtilities";

const PrivacyPolicyPage = () => {
  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <div className="legal-card">
          <Heading>Política de Privacidad</Heading>
          <p>
            En cumplimiento del Reglamento General de Protección de Datos (RGPD)
            y la Ley Orgánica de Protección de Datos y Garantía de los Derechos
            Digitales (LOPDGDD), te informamos sobre cómo recopilamos,
            utilizamos y protegemos tus datos personales.
          </p>
          <Heading as="h2">Responsable del Tratamiento</Heading>
          <p>
            <strong>Nombre:</strong> Acandemy
            <br />
            <strong>Correo Electrónico:</strong>{" "}
            <a href="mailto:aa@gmail.com">aa@gmail.com</a>
            <br />
            <strong>Teléfono:</strong>{" "}
            <a href="tel:+34123456789">+34 123 456 789</a>
          </p>
          <Heading as="h2">Datos Recopilados</Heading>
          <ul>
            <li>Nombre y apellidos</li>
            <li>Correo electrónico</li>
            <li>Teléfono</li>
            <li>Dirección</li>
          </ul>
          <Heading as="h2">Finalidad del Tratamiento</Heading>
          <ul>
            <li>Responder a tus consultas</li>
            <li>Gestionar pedidos y servicios</li>
            <li>
              Enviar comunicaciones comerciales (si has dado tu consentimiento)
            </li>
          </ul>
          <Heading as="h2">Tus Derechos</Heading>
          <p>
            Tienes derecho a acceder, rectificar, eliminar y oponerte al
            tratamiento de tus datos personales. Para ejercer estos derechos,
            contacta con nosotros a través del correo electrónico proporcionado.
          </p>
        </div>
      </Box>
    </ResponsiveLayout>
  );
};

export default PrivacyPolicyPage;
