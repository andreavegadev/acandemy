import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Heading from "../../components/Heading";
import Breadcrumbs from "../../components/Breadcrumbs";

const AddPetPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    birth_date: "",
    neck_size: "",
    chest_size: "",
    weight: "",
    species: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "select-one" && name === "active" ? value === "true" : value,
    }));
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
        active: formData.active,
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
    <>
      <Breadcrumbs
        items={[
          { label: "Mis mascotas", href: "/profile/pets" },
          {
            label: `Nueva Mascota`,
            current: true,
          },
        ]}
      />
      <Heading>Añadir Mascota</Heading>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          id="name"
          name="name"
          label="Nombre"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          id="species"
          name="species"
          label="Especie"
          value={formData.species}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          id="breed"
          name="breed"
          label="Raza"
          value={formData.breed}
          onChange={handleInputChange}
        />
        <Input
          type="date"
          id="birth_date"
          name="birth_date"
          label="Fecha de Nacimiento"
          value={formData.birth_date}
          onChange={handleInputChange}
        />
        <Input
          type="number"
          id="neck_size"
          name="neck_size"
          label="Medida del Cuello (cm)"
          value={formData.neck_size}
          onChange={handleInputChange}
          step="0.01"
        />
        <Input
          type="number"
          id="chest_size"
          name="chest_size"
          label="Medida del Pecho (cm)"
          value={formData.chest_size}
          onChange={handleInputChange}
          step="0.01"
        />
        <Input
          type="number"
          id="weight"
          name="weight"
          label="Peso (kg)"
          value={formData.weight}
          onChange={handleInputChange}
          step="0.01"
        />
        <Select
          id="active"
          name="active"
          label="Estado"
          value={formData.active}
          onChange={handleInputChange}
          options={[
            { value: true, label: "Activo" },
            { value: false, label: "Inactivo" },
          ]}
        />
        <ButtonPrimary
          type="submit"
          disabled={loading}
          aria-label="Añadir mascota"
        >
          {loading ? "Añadiendo..." : "Añadir Mascota"}
        </ButtonPrimary>
      </form>
    </>
  );
};

export default AddPetPage;
