import { ButtonLink } from "../components/Button";
import Heading from "../components/Heading";

const ErrorPage = () => {
  return (
    <div className="error-page-container">
      <Heading>404</Heading>
      <Heading as="h2">Página no encontrada</Heading>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <ButtonLink href={`/`} aria-label={`Volver al inicio`}>
        Volver al Inicio
      </ButtonLink>
    </div>
  );
};

export default ErrorPage;
