import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonLink, ButtonPrimary } from "../../components/Button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Enviar correo de recuperación de contraseña
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, // URL a la que se redirige tras el restablecimiento
    });

    if (error) {
      console.error(
        "Error al enviar el correo de recuperación:",
        error.message
      );
      setError("Hubo un problema al enviar el correo. Inténtalo de nuevo.");
    } else {
      setMessage(
        "Correo de recuperación enviado. Revisa tu bandeja de entrada."
      );
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <ButtonPrimary
          type="submit"
          aria-label={`Enviar enlace de recuperación de contraseña`}
        >
          Enviar Enlace de Recuperación
        </ButtonPrimary>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <div className="links">
        <p>
          <ButtonLink href={`/login`} aria-label={`Volver a iniciar sesión`}>
            Volver a Iniciar Sesión
          </ButtonLink>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
