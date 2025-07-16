import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ButtonDanger, ButtonPrimary } from "../../components/Button";
import Breadcrumbs from "../../components/Breadcrumbs";
import Input from "../../components/Input";
import Heading from "../../components/Heading";
import { Stack } from "../../components/LayoutUtilities";
import TextArea from "../../components/TextArea";
import Select from "../../components/Select";
import { Checkbox } from "../../components/Checkbox";

const EditDiscountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = !location.pathname.endsWith("/edit");

  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "Percentage",
    percentage: "",
    amount: "",
    min_order: "",
    max_uses: "",
    start_date: "",
    end_date: "",
    active: true,
    user_id: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("No se pudo cargar el descuento.");
      } else {
        setForm({
          code: data.code || "",
          description: data.description || "",
          type: data.type || "Percentage",
          percentage: data.percentage ?? "",
          amount: data.amount ?? "",
          min_order: data.min_order ?? "",
          max_uses: data.max_uses ?? "",
          start_date: data.start_date ? data.start_date.substring(0, 10) : "",
          end_date: data.end_date ? data.end_date.substring(0, 10) : "",
          active: !!data.active,
          user_id: data.user_id || "",
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
    const payload = {
      ...form,
      percentage: form.type === "Percentage" ? Number(form.percentage) : null,
      amount: form.type === "Amount" ? Number(form.amount) : null,
      min_order: form.min_order ? Number(form.min_order) : null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      user_id: form.user_id || null,
    };
    const { error } = await supabase
      .from("discounts")
      .update(payload)
      .eq("id", id);
    if (error) {
      setError("Error al actualizar el descuento: " + error.message);
    } else {
      setSuccess("Descuento actualizado correctamente.");
      setTimeout(() => navigate(-1), 1200);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/discounts/${id}/edit`);
  };
  const handleDelete = async () => {
    setError("");
    setSuccess("");
    const { error } = await supabase.from("discounts").delete().eq("id", id);
    if (error) {
      setError("Error al eliminar el descuento: " + error.message);
    } else {
      setSuccess("Descuento eliminado correctamente.");
      setTimeout(() => navigate("/admin/discounts"), 1200);
    }
  };

  return (
    <Stack gap={24}>
      {" "}
      <Breadcrumbs
        items={[
          {
            label: "Descuentos",
            onClick: () => navigate("/admin/discounts"),
          },
          {
            label: `Descuento`,
            current: true,
          },
        ]}
      ></Breadcrumbs>
      <Heading>
        {isViewMode ? "Detalle del descuento" : "Editar descuento"}
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap={16}>
          <Input
            type="text"
            name="code"
            label="Código"
            value={form.code}
            onChange={handleChange}
            required
            readOnly={isViewMode}
          />
          <TextArea
            name="description"
            label="Descripción"
            value={form.description}
            onChange={handleChange}
            readOnly={isViewMode}
          />
          <Select
            name="type"
            label="Tipo"
            value={form.type}
            onChange={handleChange}
            readOnly={isViewMode}
            options={[
              { value: "Percentage", label: "Porcentaje" },
              { value: "Amount", label: "Importe fijo" },
            ]}
          />
          {form.type === "Percentage" && (
            <Input
              type="number"
              name="percentage"
              label="Porcentaje (%)"
              value={form.percentage}
              onChange={handleChange}
              min="1"
              max="100"
              required
              readOnly={isViewMode}
            />
          )}
          {form.type === "Amount" && (
            <Input
              type="number"
              name="amount"
              label="Importe (€)"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              readOnly={isViewMode}
            />
          )}
          <Input
            type="number"
            name="min_order"
            label="Pedido mínimo (€)"
            value={form.min_order}
            onChange={handleChange}
            min="0"
            step="0.01"
            readOnly={isViewMode}
          />
          <Input
            type="number"
            name="max_uses"
            label="Máx. usos"
            value={form.max_uses}
            onChange={handleChange}
            min="1"
            readOnly={isViewMode}
          />
          <Input
            type="date"
            name="start_date"
            label="Válido desde"
            value={form.start_date}
            onChange={handleChange}
            readOnly={isViewMode}
          />
          <Input
            type="date"
            name="end_date"
            label="Válido hasta"
            value={form.end_date}
            onChange={handleChange}
            readOnly={isViewMode}
          />
          <Input
            type="text"
            name="user_id"
            label="ID usuario (opcional)"
            value={form.user_id}
            onChange={handleChange}
            readOnly={isViewMode}
          />
          <Checkbox
            label={"Activo"}
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
  );
};

export default EditDiscountPage;
