import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const PetDetailPage = () => {
  const { id } = useParams(); // Obtiene el ID de la mascota desde la URL
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(
          "Error al obtener los datos de la mascota:",
          error.message
        );
        setError("No se pudieron cargar los datos de la mascota.");
      } else {
        setPet(data);
      }

      setLoading(false);
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return <p>Cargando datos de la mascota...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="pet-detail-container">
      <h2>Detalles de la Mascota</h2>
      {pet ? (
        <div>
          <p>
            <strong>Nombre:</strong> {pet.name}
          </p>
          <p>
            <strong>Especie:</strong> {pet.species}
          </p>
          <p>
            <strong>Raza:</strong> {pet.breed || "Sin raza"}
          </p>
          <p>
            <strong>Fecha de nacimiento:</strong>{" "}
            {pet.birth_date || "No especificada"}
          </p>
          <p>
            <strong>Medida del cuello:</strong>{" "}
            {pet.neck_size ? `${pet.neck_size} cm` : "No especificada"}
          </p>
          <p>
            <strong>Medida del pecho:</strong>{" "}
            {pet.chest_size ? `${pet.chest_size} cm` : "No especificada"}
          </p>
          <p>
            <strong>Peso:</strong>{" "}
            {pet.weight ? `${pet.weight} kg` : "No especificado"}
          </p>
          <p>
            <strong>Estado:</strong> {pet.active ? "Activo" : "Inactivo"}
          </p>
        </div>
      ) : (
        <p>No se encontraron datos para esta mascota.</p>
      )}
    </div>
  );
};

export default PetDetailPage;
