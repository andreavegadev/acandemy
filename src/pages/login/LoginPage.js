import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { ButtonLink, ButtonPrimary } from "../../components/Button";
import Heading from "../../components/Heading";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import { Box, Stack } from "../../components/LayoutUtilities";
import Input from "../../components/Input";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Autenticar al usuario con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    } else {
      navigate("/home");
    }
  };

  return (
    <ResponsiveLayout contentWidth="narrow">
      <Box paddingY={48}>
        <Stack gap={24}>
          <Heading>Iniciar sesión</Heading>
          <form onSubmit={handleSubmit}>
            <Stack gap={16}>
              <Input
                type="email"
                name="email"
                label="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                autoComplete
                required
              />
              <Input
                type="password"
                name="password"
                label="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <ButtonPrimary
                type="submit"
                aria-label={`Iniciar sesión con correo`}
                fullWidth
              >
                Iniciar Sesión
              </ButtonPrimary>
            </Stack>
          </form>
          {error && <p className="error">{error}</p>}
          <div className="links">
            <p>
              <ButtonLink
                bleedLeft
                href={`/forgot-password`}
                aria-label={`¿Olvisate tu contraseña?`}
              >
                ¿Olvidaste tu contraseña?
              </ButtonLink>
            </p>
            <p>¿No tienes una cuenta? Registrate en un minuto.</p>
            <p>
              <ButtonPrimary
                href={`/register`}
                aria-label={`Registrase`}
                fullWidth
              >
                Registrarse
              </ButtonPrimary>
            </p>
          </div>
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
};

export default LoginPage;
