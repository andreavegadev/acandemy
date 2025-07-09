import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonLink, ButtonPrimary } from "../../components/Button";
import Heading from "../../components/Heading";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import { Box, Stack } from "../../components/LayoutUtilities";
import Input from "../../components/Input";

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
    <ResponsiveLayout contentWidth="narrow">
      <Box paddingY={48}>
        <Stack gap={24}>
          <Heading as="h2">Recuperar Contraseña</Heading>
          <form onSubmit={handleSubmit}>
            <Stack gap={16}>
              <Input
                type="email"
                name="email"
                label="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <ButtonPrimary
                type="submit"
                aria-label={`Enviar enlace de recuperación de contraseña`}
                fullWidth
              >
                Enviar Enlace de Recuperación
              </ButtonPrimary>
            </Stack>
          </form>
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
          <div className="links">
            <p>
              <ButtonLink
                href={`/login`}
                aria-label={`Volver a iniciar sesión`}
                bleedLeft
              >
                Volver a inicio de sesión
              </ButtonLink>
            </p>
          </div>
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
};

export default ForgotPasswordPage;
