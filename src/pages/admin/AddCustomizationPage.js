import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Input from "../../components/Input";
import { ButtonPrimary } from "../../components/Button";
import Heading from "../../components/Heading";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Stack } from "../../components/LayoutUtilities";
import TextArea from "../../components/TextArea";

const AddCustomizationPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const { error } = await supabase.from("personalization_types").insert([
      {
        name: form.name,
        description: form.description,
      },
    ]);
    if (error) {
      setError("Error al crear el tipo de personalización: " + error.message);
    } else {
      setSuccess("Tipo de personalización creado correctamente.");
      setTimeout(() => navigate("/admin/customizations"), 1200);
    }
  };

  return (

      <Stack gap={24}>
        <Breadcrumbs
          items={[
            {
              label: "Personalizaciones",
              onClick: () => navigate("/admin/customizations"),
            },
            {
              label: `Tipo de personalización`,
              current: true,
            },
          ]}
        ></Breadcrumbs>
        <Heading>Crear personalización</Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap={16}>
            <Input
              type="text"
              name="name"
              label="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextArea
              name="description"
              label="Descripción"
              value={form.description}
              onChange={handleChange}
              required
            />
            <ButtonPrimary type="submit">Crear personalización</ButtonPrimary>
          </Stack>
        </form>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </Stack>

  );
};

export default AddCustomizationPage;
