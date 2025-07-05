import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ButtonLink } from "./Button";

const UserButton = () => {
  const [session, setSession] = useState(null);

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

  if (!session) {
    return null; // No muestra el botón si no hay sesión
  }

  return (
    <ButtonLink href={`/profile`} aria-label={`Ir al perfil}`}>
      Mi Perfil
    </ButtonLink>
  );
};

export default UserButton;
