import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Input from "../../components/Input";
import { ButtonPrimary } from "../../components/Button";
import Heading from "../../components/Heading";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Box, Stack } from "../../components/LayoutUtilities";
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
    <Box paddingY={24}>
      <Stack gap={24}>
        <Heading>Crear tipo de personalización</Heading>
        <Breadcrumbs
          items={[
            {
              label: "Tipos de personalización",
              onClick: () => navigate("/admin/customizations"),
            },
            {
              label: `Tipo de personalización`,
              current: true,
            },
          ]}
        ></Breadcrumbs>
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
            <ButtonPrimary type="submit">
              Crear tipo de personalización
            </ButtonPrimary>
          </Stack>
        </form>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </Stack>
    </Box>
  );
};

export default AddCustomizationPage;
