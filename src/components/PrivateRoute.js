import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user); // Si hay un usuario, está autenticado
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras se verifica la autenticación
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
