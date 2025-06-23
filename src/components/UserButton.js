import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const UserButton = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener la sesión:", error.message);
      } else {
        setSession(data.session);
      }
    };

    fetchSession();
  }, []);

  const handleNavigate = () => {
    navigate("/profile"); // Redirige al perfil del usuario
  };

  if (!session) {
    return null; // No muestra el botón si no hay sesión
  }

  return (
    <button onClick={handleNavigate} className="user-button">
      Mi Perfil
    </button>
  );
};

export default UserButton;
