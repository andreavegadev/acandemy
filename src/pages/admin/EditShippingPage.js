import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary, ButtonDanger } from "../../components/Button";
import Input from "../../components/Input";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { Box, Stack } from "../../components/LayoutUtilities";
import { Checkbox } from "../../components/Checkbox";

const EditShippingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = !location.pathname.endsWith("/edit");

  const [form, setForm] = useState({
    name: "",
    price: "",
    estimated_days: "",
    active: true,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("shipping")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("No se pudo cargar el método de envío.");
      } else {
        setForm({
          name: data.name || "",
          price: data.price ?? "",
          estimated_days: data.estimated_days ?? "",
          active: !!data.active,
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
      .from("shipping")
      .update({
        name: form.name,
        price: Number(form.price),
        estimated_days: Number(form.estimated_days),
        active: form.active,
      })
      .eq("id", id);
    if (error) {
      setError("Error al actualizar el método de envío: " + error.message);
    } else {
      setSuccess("Método de envío actualizado correctamente.");
      setTimeout(() => navigate(-1), 1200);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/shippings/${id}/edit`);
  };

  const handleDelete = async () => {
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("shipping")
      .delete()
      .eq("id", id);
    if (error) {
      setError("Error al eliminar el método de envío: " + error.message);
    } else {
      setSuccess("Método de envío eliminado correctamente.");
      setTimeout(() => navigate("/admin/shippings"), 1200);
    }
  };

  return (
    <Box paddingY={24}>
      <Stack gap={24}>
        <Breadcrumbs
          items={[
            { label: "Envíos", onClick: () => navigate("/admin/shippings") },
            {
              label: `Envío`,
              current: true,
            },
          ]}
        ></Breadcrumbs>
        <Heading>
          {isViewMode
            ? "Detalle del Método de Envío"
            : "Editar Método de Envío"}
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
            <Input
              type="number"
              name="price"
              label="Precio"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              readOnly={isViewMode}
            />
            <Input
              type="number"
              name="estimated_days"
              label="Días estimados"
              value={form.estimated_days}
              onChange={handleChange}
              required
              min="0"
              readOnly={isViewMode}
            />

            <Checkbox
              label="Activo"
              name="active"
              checked={form.active}
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
    </Box>
  );
};

export default EditShippingPage;
