import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const PetListPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError("");

      // Obtén el usuario autenticado
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error al obtener el usuario:", userError.message);
        setError("No se pudo obtener el usuario. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }

      // Obtén las mascotas del usuario autenticado
      const { data, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id);

      if (petsError) {
        console.error("Error al obtener las mascotas:", petsError.message);
        setError("No se pudieron cargar las mascotas. Inténtalo de nuevo.");
      } else {
        setPets(data);
      }

      setLoading(false);
    };

    fetchPets();
  }, []);

  if (loading) {
    return <p>Cargando mascotas...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="pet-list-container">
      <h2>Mis Mascotas</h2>
      {pets.length > 0 ? (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              <Link to={`/pets/${pet.id}`}>
                <strong>{pet.name}</strong> - {pet.species}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes mascotas registradas.</p>
      )}
    </div>
  );
};

export default PetListPage;
