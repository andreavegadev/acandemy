import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthPages.css";
import { ButtonLink, ButtonPrimary } from "../../components/Button";

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
    <div className="auth-bg">
      <div className="auth-page">
        <h1>Iniciar sesión</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <ButtonPrimary type="submit" aria-label={`Iniciar sesión con correo`}>
            Iniciar Sesión
          </ButtonPrimary>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="links">
          <p>
            <ButtonLink
              href={`/forgot-password`}
              aria-label={`¿Olvisate tu contraseña?`}
            >
              ¿Olvidaste tu contraseña?
            </ButtonLink>
          </p>
          <p>
            <ButtonPrimary href={`/register`} aria-label={`Registrase`}>
              Registrarse
            </ButtonPrimary>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
