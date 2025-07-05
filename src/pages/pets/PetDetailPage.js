import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../styles/PetDetailPage.css";

const cardStyle = {
  border: "1px solid #d1c4e9",
  borderRadius: 16,
  boxShadow: "0 2px 12px #ede7f6",
  padding: 32,
  margin: "40px auto",
  maxWidth: 500,
  color: "#3a2e5c",
};

const fieldStyle = {
  marginBottom: 12,
  fontSize: 16,
};

const labelStyle = {
  color: "#5e35b1",
  fontWeight: 600,
  minWidth: 140,
  display: "inline-block",
};

const actionsStyle = {
  display: "flex",
  gap: 16,
  marginTop: 24,
};

const buttonStyle = {
  background: "#ede7f6",
  border: "none",
  color: "#5e35b1",
  fontWeight: "bold",
  padding: "8px 20px",
  borderRadius: 8,
  cursor: "pointer",
  transition: "background 0.2s",
};

const PetDetailPage = ({ pet: initialPet, onClose, onSave }) => {
  const { id } = useParams(); // Obtiene el ID de la mascota desde la URL
  const navigate = useNavigate();
  const [pet, setPet] = useState(initialPet);
  const [loading, setLoading] = useState(true);
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

    if (!initialPet) {
      fetchPet();
    }
  }, [id, initialPet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

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

    setLoading(false);
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ color: "#5e35b1", marginBottom: 24 }}>
        Detalles de la Mascota
      </h2>
      {isEditing ? (
        <form className="pet-detail-form">
          <div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="name">
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="species">
                Especie:
              </label>
              <input
                type="text"
                id="species"
                name="species"
                value={formData.species}
                onChange={handleInputChange}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="breed">
                Raza:
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="birth_date">
                Fecha de Nacimiento:
              </label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="neck_size">
                Medida del Cuello (cm):
              </label>
              <input
                type="number"
                id="neck_size"
                name="neck_size"
                value={formData.neck_size}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="chest_size">
                Medida del Pecho (cm):
              </label>
              <input
                type="number"
                id="chest_size"
                name="chest_size"
                value={formData.chest_size}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="weight">
                Peso (kg):
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle} htmlFor="active">
                Estado:
              </label>
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
          </div>
          <div style={actionsStyle}>
            <button type="button" style={buttonStyle} onClick={handleSave}>
              {pet && pet.id ? "Guardar cambios" : "Crear mascota"}
            </button>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div>
            <div style={fieldStyle}>
              <span style={labelStyle}>
                <strong>Nombre:</strong>
              </span>{" "}
              {pet.name}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>
                <strong>Especie:</strong>
              </span>{" "}
              {pet.species}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>
                <strong>Raza:</strong>
              </span>{" "}
              {pet.breed || "Sin raza"}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>
                <strong>Fecha de nacimiento:</strong>
              </span>{" "}
              {pet.birth_date || "No especificada"}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>
                <strong>Medida del cuello:</strong>
              </span>{" "}
              {pet.neck_size ? `${pet.neck_size} cm` : "No especificada"}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>
                <strong>Medida del pecho:</strong>
              </span>{" "}
              {pet.chest_size ? `${pet.chest_size} cm` : "No especificada"}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>
                <strong>Peso:</strong>
              </span>{" "}
              {pet.weight ? `${pet.weight} kg` : "No especificado"}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>
                <strong>Estado:</strong>
              </span>{" "}
              {pet.active ? "Activo" : "Inactivo"}
            </div>
          </div>
          <div style={actionsStyle}>
            <button style={buttonStyle} onClick={() => setIsEditing(true)}>
              Editar Mascota
            </button>
            <button style={buttonStyle} onClick={() => navigate("/profile")}>
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetailPage;
