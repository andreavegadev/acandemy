import React from "react";

//import "./LoginPage.css"; // TODO crear archivos

const LoginPage = () => {
  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form action="/home" method="post">
        <input type="text" name="username" placeholder="Usuario" required />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
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
