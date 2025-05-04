import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import PetList from "../../components/PetList";

const PetListPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error al obtener la sesión:", sessionError.message);
        setLoading(false);
        return;
      }

      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        console.error("No se pudo obtener el ID del usuario.");
        setLoading(false);
        return;
      }

      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("id, name, birth_date")
        .eq("user_id", userId);

      if (petsError) {
        console.error("Error al obtener las mascotas:", petsError.message);
      } else {
        setPets(petsData);
      }

      setLoading(false);
    };

    fetchPets();
  }, []);

  const handleEditPet = (petId) => {
    navigate(`/pets/${petId}/edit`);
  };

  const handleAddPet = () => {
    navigate("/pets/add");
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <PetList pets={pets} onEditPet={handleEditPet} onAddPet={handleAddPet} />
  );
};

export default PetListPage;
