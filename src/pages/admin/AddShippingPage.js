import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { Stack } from "../../components/LayoutUtilities";
import { Checkbox } from "../../components/Checkbox";
import Input from "../../components/Input";

const AddShippingPage = ({ onCreated, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    estimated_days: "",
    active: true,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    const { error } = await supabase.from("shipping").insert([
      {
        name: form.name,
        price: Number(form.price),
        estimated_days: Number(form.estimated_days),
        active: form.active,
      },
    ]);
    if (error) {
      setError("Error al crear el método de envío: " + error.message);
    } else {
      setSuccess("Método de envío creado correctamente.");
      setTimeout(() => navigate("/admin/shippings"), 1200);
      setForm({
        name: "",
        price: "",
        estimated_days: "",
        active: true,
      });
      if (onCreated) onCreated();
    }
  };

  return (
    <Stack gap={24}>
      {" "}
      <Breadcrumbs
        items={[
          { label: "Envíos", onClick: () => navigate("/admin/shippings") },
          {
            label: `Envío`,
            current: true,
          },
        ]}
      ></Breadcrumbs>
      <div className="add-panel">
        <Heading as="h2">Crear método de envío</Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={16}>
            <label>
              Nombre:
              <Input
                type="text"
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </label>

            <Input
              label="Precio"
              type="number"
              name="price"
              placeholder="Precio"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />

            <Input
              label="Días estimados"
              type="number"
              name="estimated_days"
              placeholder="Días estimados"
              value={form.estimated_days}
              onChange={handleChange}
              required
              min="0"
            />
            <Checkbox
              label={"Activo"}
              name="active"
              checked={form.active}
              onChange={handleChange}
            ></Checkbox>
            <div className="panel-actions">
              <ButtonPrimary type="submit">
                Guardar nuevo método de envío
              </ButtonPrimary>
              {onCancel && (
                <ButtonSecondary aria-label={`Cancel`} onClick={onCancel}>
                  Cancelar
                </ButtonSecondary>
              )}
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </Stack>
        </form>
      </div>
    </Stack>
  );
};

export default AddShippingPage;
