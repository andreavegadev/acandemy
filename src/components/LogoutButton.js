import React from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { ButtonLink } from "./Button";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
    } else {
      navigate("/login"); // Redirige al usuario a la página de login
    }
  };

  return (
    <ButtonLink onClick={handleLogout} aria-label="Cerrar sesión">
      Cerrar Sesión
    </ButtonLink>
  );
};

export default LogoutButton;
