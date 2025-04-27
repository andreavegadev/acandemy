import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const [userData, setUserData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error al obtener el usuario:", error.message);
        setLoading(false);
        return;
      }

      const { data, error: userError } = await supabase
        .from("users")
        .select("full_name, phone, address")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error al obtener los datos del usuario:", userError.message);
      } else {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error al obtener el usuario:", error.message);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        full_name: userData.full_name,
        phone: userData.phone,
        address: userData.address,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error al actualizar los datos del usuario:", updateError.message);
    } else {
      alert("Datos actualizados correctamente.");
    }
    setLoading(false);
  };

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="user-profile">
      <h1>Perfil de Usuario</h1>
      <form>
        <div>
          <label htmlFor="full_name">Nombre Completo:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={userData.full_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="address">Dirección:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleSave}>
          Guardar Cambios
        </button>
      </form>
      <button onClick={handleResetPassword}>Restablecer Contraseña</button>
    </div>
  );
};

export default UserProfilePage;