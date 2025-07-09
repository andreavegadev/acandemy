import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../../components/Button";
import Heading from "../../components/Heading";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import { Stack } from "../../components/LayoutUtilities";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el usuario está autenticado temporalmente
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setError("El enlace de restablecimiento no es válido o ha expirado.");
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Error al restablecer la contraseña:", error.message);
      setError(
        "Hubo un problema al restablecer la contraseña. Inténtalo de nuevo."
      );
    } else {
      setMessage(
        "Contraseña restablecida con éxito. Ahora puedes iniciar sesión."
      );
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <ResponsiveLayout contentWidth="narrow">
      <Stack gap={24}>
        <Heading as="h2">Restablecer Contraseña</Heading>
        <Stack gap={16}>
          {error ? (
            <p className="error">{error}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack gap={16}>
                <input
                  type="password"
                  name="password"
                  placeholder="Nueva Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <ButtonPrimary type="submit">
                  Restablecer Contraseña
                </ButtonPrimary>
              </Stack>
            </form>
          )}
        </Stack>
        {message && <p className="success">{message}</p>}
        <div className="links">
          <p>
            <ButtonPrimary
              href={`/login`}
              aria-label={`Volver a iniciar sesión`}
            >
              Volver a iniciar Sesión
            </ButtonPrimary>
          </p>
        </div>
      </Stack>
    </ResponsiveLayout>
  );
};

export default ResetPasswordPage;
