import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../styles/PetDetailPage.css";
import Heading from "../../components/Heading";
import { ButtonDanger, ButtonPrimary } from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Breadcrumbs from "../../components/Breadcrumbs";

const PetDetailPage = ({ pet: initialPet, onClose, onSave }) => {
  const { id } = useParams(); // Obtiene el ID de la mascota desde la URL
  const [pet, setPet] = useState(initialPet);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: initialPet?.name || "",
    species: initialPet?.species || "",
    breed: initialPet?.breed || "",
    birth_date: initialPet?.birth_date || "",
    neck_size: initialPet?.neck_size || "",
    chest_size: initialPet?.chest_size || "",
    weight: initialPet?.weight || "",
    active: initialPet?.active ?? true,
  });

  useEffect(() => {
    const fetchPet = async () => {
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
    };

    if (!initialPet) {
      fetchPet();
    }
  }, [id, initialPet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "active" ? value === "true" : value,
    }));
  };

  const handleSave = async () => {
    if (pet && pet.id) {
      // update
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
        .eq("id", pet.id);

      if (error) {
        console.error(
          "Error al actualizar los datos de la mascota:",
          error.message
        );
        setError("No se pudieron guardar los cambios.");
      } else {
        alert("Datos de la mascota actualizados correctamente.");
        setIsEditing(false);
        if (onSave) onSave();
      }
    } else {
      // create
      const { error } = await supabase.from("pets").insert([formData]);

      if (error) {
        console.error("Error al crear la mascota:", error.message);
        setError("No se pudo crear la mascota.");
      } else {
        alert("Mascota creada correctamente.");
        if (onSave) onSave();
      }
    }
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!pet) {
    return <p>No se encontró la mascota.</p>;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Mis mascotas", href: "/profile/pets" },
          {
            label: `${pet.name || "Nueva Mascota"}`,
            current: true,
          },
        ]}
      />
      <Heading as="h2">
        {isEditing
          ? `Editar mascota${formData.name ? `: ${formData.name}` : ""}`
          : `Detalles de${pet?.name ? ` ${pet.name}` : ""}`}
      </Heading>
      {isEditing ? (
        <form className="pet-detail-form">
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
            style={{ width: "100%" }}
          />
          <Input
            type="number"
            id="neck_size"
            name="neck_size"
            label="Medida del Cuello (cm)"
            value={formData.neck_size}
            onChange={handleInputChange}
            step="0.01"
            style={{ width: "100%" }}
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

          <div>
            <ButtonPrimary
              onClick={handleSave}
              aria-label={`Guardar cambios de mascota ${pet.name}`}
            >
              {pet && pet.id ? "Guardar cambios" : "Crear mascota"}
            </ButtonPrimary>
            <ButtonDanger
              onClick={() => setIsEditing(false)}
              aria-label={`Cancelar edición de mascota ${pet.name}`}
            >
              Cancelar
            </ButtonDanger>
          </div>
        </form>
      ) : (
        <form className="pet-detail-form" style={{ marginBottom: 0 }}>
          <Input
            type="text"
            label="Nombre"
            value={pet.name}
            readOnly
            style={{ marginBottom: 12 }}
          />
          <Input
            type="text"
            label="Especie"
            value={pet.species}
            readOnly
            style={{ marginBottom: 12 }}
          />
          <Input
            type="text"
            label="Raza"
            value={pet.breed || "Sin raza"}
            readOnly
            style={{ marginBottom: 12 }}
          />
          <Input
            type="text"
            label="Fecha de nacimiento"
            value={pet.birth_date || "No especificada"}
            readOnly
            style={{ marginBottom: 12 }}
          />
          <Input
            type="text"
            label="Medida del cuello (cm)"
            value={pet.neck_size ? `${pet.neck_size} cm` : "No especificada"}
            readOnly
            style={{ marginBottom: 12 }}
          />
          <Input
            type="text"
            label="Medida del pecho (cm)"
            value={pet.chest_size ? `${pet.chest_size} cm` : "No especificada"}
            readOnly
            style={{ marginBottom: 12 }}
          />
          <Input
            type="text"
            label="Peso (kg)"
            value={pet.weight ? `${pet.weight} kg` : "No especificado"}
            readOnly
            style={{ marginBottom: 12 }}
          />
          <Select
            label="Estado"
            value={pet.active ? "true" : "false"}
            readOnly
            options={[
              { value: "true", label: "Activo" },
              { value: "false", label: "Inactivo" },
            ]}
            style={{ marginBottom: 12 }}
          />
          <div>
            <ButtonPrimary
              onClick={() => setIsEditing(true)}
              aria-label={`Editar mascota`}
            >
              Editar Mascota
            </ButtonPrimary>
          </div>
        </form>
      )}
    </>
  );
};

export default PetDetailPage;
