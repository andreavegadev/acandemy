import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary } from "../../components/Button";
import Heading from "../../components/Heading";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Box, Stack } from "../../components/LayoutUtilities";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Select from "../../components/Select";

const AddCustomizationProductPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product_id");
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    additional_price: 0,
    personalization_type_id: "",
    active: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productName, setProductName] = useState("");

  useEffect(() => {
    supabase
      .from("personalization_types")
      .select("*")
      .then(({ data }) => setTypes(data || []));
  }, []);

  // Obtener el nombre del producto
  useEffect(() => {
    if (product_id) {
      supabase
        .from("products")
        .select("name")
        .eq("id", product_id)
        .single()
        .then(({ data }) => setProductName(data?.name || ""));
    }
  }, [product_id]);

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
    const { error } = await supabase.from("personalizations").insert([
      {
        ...form,
        product_id: Number(product_id),
        additional_price: Number(form.additional_price),
        personalization_type_id: Number(form.personalization_type_id),
      },
    ]);
    if (error) {
      setError("Error al crear la personalización: " + error.message);
    } else {
      setSuccess("Personalización creada correctamente.");
      setTimeout(() => navigate(-1), 1200);
    }
  };

  return (
    <Stack gap={24}>
      {" "}
      <Breadcrumbs
        items={[
          {
            label: "Productos",
            onClick: () => navigate("/admin/products"),
          },
          {
            label: productName ? productName : "Producto",
            onClick: () =>
              product_id && navigate(`/admin/products/${product_id}`),
          },
          {
            label: `Personalización`,
            href: `admin/products/customizations`,
            current: true,
          },
        ]}
      ></Breadcrumbs>
      <Heading>
        Añadir personalización a {productName ? `: ${productName}` : ""}
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack gap={16}>
          <Input
            id="name"
            type="text"
            name="name"
            label="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Select
            id="personalization_type_id"
            name="personalization_type_id"
            label="Tipo de personalización"
            value={form.personalization_type_id}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Selecciona un tipo" },
              ...types.map((t) => ({
                value: t.id,
                label: t.name,
              })),
            ]}
          />
          <Input
            id="additional_price"
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
            id="description"
            type="text"
            name="description"
            label="Descripción"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            label="Activo"
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />

          <ButtonPrimary type="submit">Guardar</ButtonPrimary>
        </Stack>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </Stack>
  );
};

export default AddCustomizationProductPage;
