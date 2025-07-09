import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import Heading from "../../components/Heading";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";

const ListPersonalizationTypePage = ({ onCreated, onCancel }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const { error: insertError } = await supabase
      .from("personalization_types")
      .insert([
        {
          name: name.trim(),
          description: description.trim(),
        },
      ]);

    if (insertError) {
      setError("Error al crear el tipo: " + insertError.message);
    } else {
      setSuccess(true);
      setName("");
      setDescription("");
      if (onCreated) onCreated();
    }
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: "Personalizaciones",
            onClick: () => navigate("/admin/customizations"),
          },
          {
            label: `Personalización`,
            current: true,
          },
        ]}
      ></Breadcrumbs>
      <div className="add-panel">
        <Heading as="h2">Crear tipo de personalización</Heading>
        <form onSubmit={handleSubmit}>
          <label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              label="Nombre"
            />
          </label>
          <label>
            <Input
              type="text"
              label="Descripción "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <div className="panel-actions">
            <ButtonPrimary type="submit" aria-label={`Crear personalización`}>
              Crear
            </ButtonPrimary>
            {onCancel && (
              <ButtonSecondary onClick={onCancel} aria-label={`Cancelar`}>
                Cancelar
              </ButtonSecondary>
            )}
          </div>
          {error && <div className="error">{error}</div>}
          {success && (
            <div className="success">¡Tipo de personalización creado!</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ListPersonalizationTypePage;
