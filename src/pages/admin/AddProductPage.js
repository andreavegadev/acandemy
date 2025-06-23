import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "../../styles/AddProductPage.css";

const AddProductPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo_url: "",
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
      photo_url,
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
        photo_url,
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
        photo_url: "",
        handmade: false,
        category_id: "",
      });
    }
  };

  return (
    <div className="add-product-page">
      <h1>Añadir Producto</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          min="0"
        />
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="photo_url"
          placeholder="URL de la imagen"
          value={form.photo_url}
          onChange={handleChange}
        />
        <label>
          <input
            type="checkbox"
            name="handmade"
            checked={form.handmade}
            onChange={handleChange}
          />
          Hecho a mano
        </label>
        <button type="submit">Añadir producto</button>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddProductPage;
