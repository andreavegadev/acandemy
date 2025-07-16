import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary, ButtonDanger } from "../../components/Button";
import Input from "../../components/Input";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { Stack } from "../../components/LayoutUtilities";
import TextArea from "../../components/TextArea";
import { Checkbox } from "../../components/Checkbox";

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = !location.pathname.endsWith("/edit");

  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
    featured: false,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("No se pudo cargar la categoría.");
      } else {
        setForm({
          name: data.name || "",
          description: data.description || "",
          icon: data.icon || "",
          featured: !!data.featured,
        });
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const { error } = await supabase
      .from("categories")
      .update({
        name: form.name,
        description: form.description,
        icon: form.icon,
        featured: form.featured,
      })
      .eq("id", id);
    if (error) {
      setError("Error al actualizar la categoría: " + error.message);
    } else {
      setSuccess("Categoría actualizada correctamente.");
      setTimeout(() => navigate(-1), 1200);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/categories/${id}/edit`);
  };

  const handleDelete = async () => {
    setError("");
    setSuccess("");
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      setError("Error al eliminar la categoría: " + error.message);
    } else {
      setSuccess("Categoría eliminada correctamente.");
      setTimeout(() => navigate("/admin/categories"), 1200);
    }
  };

  return (
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
      <Heading>
        {isViewMode ? "Detalle de la categoría" : "Editar categoría"}
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap={16}>
          <Input
            type="text"
            name="name"
            label="Nombre"
            value={form.name}
            onChange={handleChange}
            required
            readOnly={isViewMode}
          />
          <TextArea
            type="text"
            name="description"
            label="Descripción"
            value={form.description}
            onChange={handleChange}
            required
            readOnly={isViewMode}
          />
          <Input
            type="text"
            name="icon"
            label="Icono (emoji o url)"
            value={form.icon}
            onChange={handleChange}
            readOnly={isViewMode}
          />
          <Checkbox
            label={"Destacada"}
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            readOnly={isViewMode}
          />
          {!isViewMode && (
            <ButtonPrimary type="submit">Guardar cambios</ButtonPrimary>
          )}
        </Stack>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        {isViewMode && id && (
          <>
            <ButtonPrimary onClick={handleEdit}>Editar</ButtonPrimary>
            <ButtonDanger onClick={handleDelete}>Eliminar</ButtonDanger>
          </>
        )}
      </div>
    </Stack>
  );
};

export default EditCategoryPage;
