import React, { useState } from "react";

const AddPetPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    age: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nueva mascota añadida:", formData);
    alert("Mascota añadida con éxito");
    setFormData({ name: "", species: "", age: "", description: "" });
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
          </select>
        </div>
        <div>
          <label htmlFor="birthDate">Fecha de nacimiento:</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>
        <section>
          <h3>Medidas de la mascota</h3>
          <div>
            <label htmlFor="neckSize">Medida del cuello:</label>
            <input
              type="number"
              id="neckSize"
              name="neckSize"
              value={formData.neckSize}
              onChange={handleChange}
              min="0"
              step="0.1"
              placeholder="En cm"
            />
          </div>
          <div>
            <label htmlFor="chestSize">Medida del pecho:</label>
            <input
              type="number"
              id="chestSize"
              name="chestSize"
              value={formData.chestSize}
              onChange={handleChange}
              min="0"
              step="0.1"
              placeholder="En cm"
              required
            />
          </div>
        </section>
        <section>
          <h3>Desparasitaciones</h3>
          <div>
            <label htmlFor="dewormingDateInternal">
              Fecha de desparasitacion interna:
            </label>
            <input
              type="date"
              id="dewormingDateInternal"
              name="dewormingDateInternal"
              value={formData.dewormingDateInternal}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="dewormingDateExternal">
              Fecha de desparasitacion externa:
            </label>
            <input
              type="date"
              id="dewormingDateExternal"
              name="dewormingDateExternal"
              value={formData.dewormingDateExternal}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="dewormingTypeExternal">
              Tipo de desparasitacion:
            </label>
            <input
              type="text"
              id="dewormingTypeExternal"
              name="dewormingTypeExternal"
              value={formData.dewormingTypeExternal}
              onChange={handleChange}
            />
          </div>
        </section>

        <div>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Añadir Mascota</button>
      </form>
    </div>
  );
};

export default AddPetPage;
