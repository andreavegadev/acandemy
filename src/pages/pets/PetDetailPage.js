import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const PetDetailPage = () => {
  const { id } = useParams(); // Obtiene el ID de la mascota desde la URL
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    birth_date: "",
    neck_size: "",
    chest_size: "",
    weight: "",
    active: true,
  });

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
        setFormData({
          name: data.name || "",
          species: data.species || "",
          breed: data.breed || "",
          birth_date: data.birth_date || "",
          neck_size: data.neck_size || "",
          chest_size: data.chest_size || "",
          weight: data.weight || "",
          active: data.active,
        });
      }

      setLoading(false);
    };

    fetchPet();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("pets")
      .update({
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        birth_date: formData.birth_date,
        neck_size: formData.neck_size,
        chest_size: formData.chest_size,
        weight: formData.weight,
        active: formData.active,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Error al actualizar los datos de la mascota:",
        error.message
      );
      setError("No se pudieron guardar los cambios.");
    } else {
      alert("Datos de la mascota actualizados correctamente.");
      setIsEditing(false);
    }

    setLoading(false);
  };

  if (loading) {
    return <p>Cargando datos de la mascota...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="pet-detail-container">
      <h2>Detalles de la Mascota</h2>
      {isEditing ? (
        <form>
          <div>
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="species">Especie:</label>
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="breed">Raza:</label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="birth_date">Fecha de Nacimiento:</label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="neck_size">Medida del Cuello (cm):</label>
            <input
              type="number"
              id="neck_size"
              name="neck_size"
              value={formData.neck_size}
              onChange={handleInputChange}
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="chest_size">Medida del Pecho (cm):</label>
            <input
              type="number"
              id="chest_size"
              name="chest_size"
              value={formData.chest_size}
              onChange={handleInputChange}
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="weight">Peso (kg):</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="active">Estado:</label>
            <select
              id="active"
              name="active"
              value={formData.active}
              onChange={handleInputChange}
            >
              <option value={true}>Activo</option>
              <option value={false}>Inactivo</option>
            </select>
          </div>
          <button type="button" onClick={handleSave}>
            Guardar Cambios
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancelar
          </button>
        </form>
      ) : (
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
          <button onClick={() => setIsEditing(true)}>Editar Mascota</button>
          <button onClick={() => navigate("/pets")}>Volver al Listado</button>
        </div>
      )}
    </div>
  );
};

export default PetDetailPage;
