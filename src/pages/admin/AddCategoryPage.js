import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary } from "../../components/Button";
import Input from "../../components/Input";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "../../components/LayoutUtilities";
import TextArea from "../../components/TextArea";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
    featured: false,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onAddCategory = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const { name, description, icon, featured } = form;
    if (!name || !description || !icon) {
      setError("Todos los campos obligatorios deben estar completos.");
      return;
    }
    const { error } = await supabase.from("categories").insert([
      {
        name,
        description,
        icon,
        featured,
      },
    ]);
    if (error) {
      setError("Error al añadir la categoría: " + error.message);
    } else {
      setSuccess("Categoría añadida correctamente.");
      setForm({
        name: "",
        description: "",
        icon: "",
        featured: false,
      });
    }
  };

  return (
    <Box paddingY={24}>
      <Stack gap={24}>
        <Breadcrumbs
          items={[
            {
              label: "Categorías",
              onClick: () => navigate("/admin/categories"),
            },
            {
              label: `Categoría`,
              current: true,
            },
          ]}
        ></Breadcrumbs>
        <Heading>Añadir Categoría</Heading>
        <form onSubmit={onAddCategory}>
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
            <Input
              type="text"
              name="icon"
              label="Icono (emoji o clase CSS)"
              value={form.icon}
              onChange={handleChange}
              required
            />
            <Input
              label="Destacada"
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            <ButtonPrimary
              onClick={onAddCategory}
              aria-label={`Añadir categoría`}
            >
              Añadir categoría
            </ButtonPrimary>
          </Stack>
        </form>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </Stack>
    </Box>
  );
};

export default AddCategoryPage;
