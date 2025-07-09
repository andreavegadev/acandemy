import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Input from "../../components/Input";
import { ButtonSecondary } from "../../components/Button";
import Heading from "../../components/Heading";
import { Box, Stack } from "../../components/LayoutUtilities";
import TextArea from "../../components/TextArea";
import Select from "../../components/Select";
import { Checkbox } from "../../components/Checkbox";

const AddProductPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    product_images: "",
    handmade: false,
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");
      if (!error) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    // Evita valores negativos en precio y stock
    if ((name === "price" || name === "stock") && Number(value) < 0) {
      newValue = "0";
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const {
      name,
      description,
      price,
      stock,
      product_images,
      handmade,
      category_id,
    } = form;

    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !category_id ||
      Number(price) < 0 ||
      Number(stock) < 0
    ) {
      setError(
        "Todos los campos obligatorios deben estar completos y el precio/stock no pueden ser negativos."
      );
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        product_images,
        handmade,
        category_id: Number(category_id),
      },
    ]);
    if (error) {
      setError("Error al añadir el producto: " + error.message);
    } else {
      setSuccess("Producto añadido correctamente.");
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        product_images: "",
        handmade: false,
        category_id: "",
      });
    }
  };

  return (
    <Stack gap={24}>
      <Heading>Añadir Producto</Heading>
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
          <Input
            type="number"
            name="price"
            label="Precio"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
          <Input
            label="Stock"
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
          />
          <Select
            name="category_id"
            label="Categoría"
            value={form.category_id}
            onChange={handleChange}
            required
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
          <Input
            type="text"
            name="product_images"
            label="URL de la imagen"
            value={form.product_images}
            onChange={handleChange}
          />
          <Checkbox
            label="Hecho a mano"
            name="handmade"
            checked={form.handmade}
            onChange={handleChange}
          />

          <ButtonSecondary type="submit" aria-label={`Añadir producto`}>
            Añadir producto
          </ButtonSecondary>
        </Stack>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </Stack>
  );
};

export default AddProductPage;
