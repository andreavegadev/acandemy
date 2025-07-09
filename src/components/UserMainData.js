import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ButtonSecondary } from "./Button";
import Heading from "./Heading";

const UserMainData = () => {
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    id_number: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error al obtener la sesión:", sessionError.message);
        return;
      }

      const userId = sessionData?.session?.user?.id;
      const email = sessionData?.session?.user?.email;

      if (!userId) {
        console.error("No se pudo obtener el ID del usuario.");
        return;
      }

      setUserData((prev) => ({ ...prev, email }));

      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userDataError) {
        console.error(
          "Error al obtener los datos del usuario:",
          userDataError.message
        );
      } else {
        setUserData((prev) => ({
          ...prev,
          full_name: userData.full_name,
          id_number: userData.id_number,
          phone: userData.phone,
        }));
      }
    };

    fetchData();
  }, []);

  const onViewAllUserData = () => {
    navigate("/profile/all-data");
  };

  return (
    <div>
      <Heading as="h2">Datos principales</Heading>
      <p>
        <span>Nombre:</span> {userData.full_name}
      </p>
      <p>
        <span>Documento de identidad:</span>{" "}
        {userData.id_number || "No proporcionado"}
      </p>
      <p>
        <span>Email:</span> {userData.email}
      </p>
      <p>
        <span>Teléfono:</span> {userData.phone || "No proporcionado"}
      </p>
      <ButtonSecondary onClick={onViewAllUserData}>
        Ver todos mis datos
      </ButtonSecondary>
    </div>
  );
};

export default UserMainData;
