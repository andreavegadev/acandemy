import React from "react";

const ForgotPasswordPage = () => {
  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      <form action="/reset-password" method="post">
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          required
        />
        <button type="submit">Enviar Enlace de Recuperación</button>
      </form>
      <div className="links">
        <p>
          <a href="/login">Volver a Iniciar Sesión</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
