import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonDanger, ButtonPrimary } from "../../components/Button";
import Breadcrumbs from "../../components/Breadcrumbs";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Heading from "../../components/Heading";
import { Box, Stack } from "../../components/LayoutUtilities";
import Select from "../../components/Select";

const EditCustomizationProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    additional_price: 0,
    personalization_type_id: "",
    active: true,
    product_id: null,
  });
  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    supabase
      .from("personalization_types")
      .select("*")
      .then(({ data }) => setTypes(data || []));
    supabase
      .from("personalizations")
      .select("*")
      .eq("id", id)
      .single()
      .then(async ({ data }) => {
        if (data) {
          setForm(data);
          // Obtener el nombre del producto
          if (data.product_id) {
            const { data: prod } = await supabase
              .from("products")
              .select("name")
              .eq("id", data.product_id)
              .single();
            setProductName(prod?.name || "");
          }
        }
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("personalizations")
      .update({
        ...form,
        additional_price: Number(form.additional_price),
        personalization_type_id: Number(form.personalization_type_id),
      })
      .eq("id", id);
    if (error) {
      setError("Error al actualizar la personalización: " + error.message);
    } else {
      setSuccess("Personalización actualizada correctamente.");
      setTimeout(() => navigate(-1), 1200);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta personalización?"))
      return;
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("personalizations")
      .delete()
      .eq("id", id);
    if (error) {
      setError("Error al eliminar la personalización: " + error.message);
    } else {
      setSuccess("Personalización eliminada correctamente.");
      setTimeout(() => navigate(-1), 1200);
    }
  };

  return (
    <Stack gap={24}>
      <Breadcrumbs
        items={[
          {
            label: "Productos",
            onClick: () => navigate("/admin/products"),
          },
          {
            label: productName ? productName : "Producto",
            onClick: () =>
              form.product_id && navigate(`/admin/products/${form.product_id}`),
          },
          {
            label: `Personalización`,
            href: `admin/products/customizations`,
            current: true,
          },
        ]}
      ></Breadcrumbs>
      <Heading>Editar personalización de {productName}</Heading>
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
          <Select
            name="personalization_type_id"
            label="Tipo de personalización"
            value={form.personalization_type_id}
            onChange={handleChange}
            required
            options={types.map((t) => ({
              value: t.id,
              label: t.name,
            }))}
          />
          <Input
            type="number"
            name="additional_price"
            label="Precio extra"
            min="0"
            step="0.01"
            value={form.additional_price}
            onChange={handleChange}
            required
          />
          <TextArea
            type="text"
            name="description"
            label="Descripción"
            value={form.description}
            onChange={handleChange}
          />
          <label>
            <Input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Activa
          </label>
          <ButtonPrimary type="submit">Guardar</ButtonPrimary>
          <ButtonDanger
            type="button"
            style={{ marginLeft: 8, background: "#e53935" }}
            onClick={handleDelete}
          >
            Eliminar
          </ButtonDanger>
        </Stack>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </Stack>
  );
};

export default EditCustomizationProductPage;
