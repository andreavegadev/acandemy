import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsAllowed(false);
        return;
      }
      if (adminOnly) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("profile")
          .eq("id", user.id)
          .single();

        if (error || !userData) {
          setIsAllowed(false);
        } else {
          setIsAllowed(userData.profile?.toLowerCase() === "admin");
        }
      } else {
        setIsAllowed(true);
      }
    };

    checkAuth();
  }, [adminOnly]);

  if (isAllowed === null) return <p>Cargando...</p>;
  return isAllowed ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
