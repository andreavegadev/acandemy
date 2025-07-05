import { ButtonLink } from "../components/Button";

const ErrorPage = () => {
  return (
    <div className="error-page-container">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <ButtonLink href={`/`} aria-label={`Volver al inicio`}>
        Volver al Inicio
      </ButtonLink>
    </div>
  );
};

export default ErrorPage;
