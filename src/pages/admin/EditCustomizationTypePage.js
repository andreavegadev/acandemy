import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary } from "../../components/Button";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { Box, Stack } from "../../components/LayoutUtilities";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";

const EditCustomizationTypePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = !location.pathname.endsWith("/edit");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("personalization_types")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("No se pudo cargar el tipo de personalización.");
      } else {
        setForm({
          name: data.name || "",
          description: data.description || "",
        });
      }
    };
    fetchData();
  }, [id]);

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
    const { error } = await supabase
      .from("personalization_types")
      .update({
        name: form.name,
        description: form.description,
      })
      .eq("id", id);
    if (error) {
      setError("Error al actualizar el tipo: " + error.message);
    } else {
      setSuccess("Tipo de personalización actualizado correctamente.");
      setTimeout(() => navigate(-1), 1200);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/customizations/${id}/edit`);
  };

  return (
    <Box paddingY={24}>
      <Stack gap={24}>
        {" "}
        <Breadcrumbs
          items={[
            {
              label: "Tipos de personalización",
              onClick: () => navigate("/admin/customizations"),
            },
            {
              label: `Personalización`,
              current: true,
            },
          ]}
        ></Breadcrumbs>
        <Heading>
          {isViewMode
            ? "Detalle del Tipo de Personalización"
            : "Editar Tipo de Personalización"}
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
              disabled={isViewMode}
            />
            <TextArea
              type="text"
              name="description"
              label="Descripción"
              value={form.description}
              onChange={handleChange}
              required
              disabled={isViewMode}
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
            <ButtonPrimary
              onClick={handleEdit}
              style={{ background: "#5e35b1" }}
            >
              Editar
            </ButtonPrimary>
          )}
        </div>
      </Stack>
    </Box>
  );
};

export default EditCustomizationTypePage;
