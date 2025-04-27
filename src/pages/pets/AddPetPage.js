import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const AddPetPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    birth_date: "",
    neck_size: "",
    chest_size: "",
    weight: "",
    active: true, // Siempre será true por defecto
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from("pets").insert([formData]);

    if (error) {
      console.error("Error al guardar la mascota:", error.message);
      alert("Hubo un error al guardar la mascota. Inténtalo de nuevo.");
    } else {
      console.log("Mascota guardada con éxito:", data);
      alert("Mascota añadida con éxito.");
      navigate("/pets");
    }
  };

  return (
    <div className="add-pet-container">
      <h2>Añadir Nueva Mascota</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="species">Especie:</label>
          <select
            id="species"
            name="species"
            value={formData.species}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecciona una especie
            </option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Pájaro">Pájaro</option>
            <option value="Reptil">Reptil</option>
          </select>
        </div>
        <div>
          <label htmlFor="breed">Raza:</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="birth_date">Fecha de nacimiento:</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>
        <section>
          <h3>Medidas de la mascota</h3>
          <div>
            <label htmlFor="neck_size">Medida del cuello (cm):</label>
            <input
              type="number"
              id="neck_size"
              name="neck_size"
              value={formData.neck_size}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="En cm"
            />
          </div>
          <div>
            <label htmlFor="chest_size">Medida del pecho (cm):</label>
            <input
              type="number"
              id="chest_size"
              name="chest_size"
              value={formData.chest_size}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="En cm"
            />
          </div>
          <div>
            <label htmlFor="weight">Peso (kg):</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="En kg"
            />
          </div>
        </section>
        <button type="submit">Añadir Mascota</button>
      </form>
    </div>
  );
};

export default AddPetPage;
