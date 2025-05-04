import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const AddPetPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    birth_date: "",
    neck_size: "",
    chest_size: "",
    weight: "",
    species: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    const { error } = await supabase.from("pets").insert([
      {
        user_id: userId,
        name: formData.name,
        breed: formData.breed,
        birth_date: formData.birth_date,
        neck_size: formData.neck_size,
        chest_size: formData.chest_size,
        weight: formData.weight,
        species: formData.species,
        active: true,
      },
    ]);

    if (error) {
      console.error("Error al añadir la mascota:", error.message);
    } else {
      alert("Mascota añadida correctamente.");
      navigate("/profile");
    }

    setLoading(false);
  };

  return (
    <div className="add-pet-page">
      <h1>Añadir Mascota</h1>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="neck_size">Tamaño del Cuello (cm):</label>
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
          <label htmlFor="chest_size">Tamaño del Pecho (cm):</label>
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
          <label htmlFor="species">Especie:</label>
          <input
            type="text"
            id="species"
            name="species"
            value={formData.species}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Añadiendo..." : "Añadir Mascota"}
        </button>
      </form>
    </div>
  );
};

export default AddPetPage;
