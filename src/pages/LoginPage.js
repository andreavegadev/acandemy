import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    } else {
      console.log("Usuario autenticado:", data);
      navigate("/home");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
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
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="links">
        <p>
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
        </p>
        <p>
          <a href="/register">Registrarse</a>
        </p>
        <p>
          <a href="/home">Ir a Home</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
