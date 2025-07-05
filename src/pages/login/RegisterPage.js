import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthPages.css";
import { ButtonLink, ButtonPrimary } from "../../components/Button";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Registrar al usuario en Supabase
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.error("Error al registrar usuario:", error.message);
      setError("Hubo un error al registrar el usuario. Inténtalo de nuevo.");
    } else {
      console.log("Usuario registrado con éxito:", data);

      // Inserta datos adicionales en la tabla `users`
      const { error: userError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          active: true, // Por defecto, el usuario estará activo
        },
      ]);

      if (userError) {
        console.error("Error al guardar datos adicionales:", userError.message);
        setError(
          "El usuario fue registrado, pero hubo un problema al guardar los datos adicionales."
        );
      } else {
        setSuccess(
          "Usuario registrado con éxito. Ahora puedes iniciar sesión."
        );
        setTimeout(() => navigate("/login"), 3000);
      }
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-page">
        <h1>Registrarse</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            placeholder="Nombre completo"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
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
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
          />
          <ButtonPrimary type="submit" aria-label={`Registrarse con correo`}>
            Registrarse
          </ButtonPrimary>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="links">
          <p>
            <ButtonLink
              href={`/login`}
              aria-label={`¿Ya tienes una cuenta? Inicia sesión`}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </ButtonLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
