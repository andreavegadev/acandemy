import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

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
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Nueva Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Restablecer Contraseña</button>
        </form>
      )}
      {message && <p className="success">{message}</p>}
      <div className="links">
        <p>
          <a href="/login">Volver a Iniciar Sesión</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
