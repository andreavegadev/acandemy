import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import "../../styles/AddProductPage.css"; // Puedes reutilizar el CSS del producto
import { ButtonPrimary } from "../../components/Button";

const AddCategoryPage = () => {
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
    <div className="add-product-page">
      <h1>Añadir Categoría</h1>
      <form onSubmit={onAddCategory}>
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
          type="text"
          name="icon"
          placeholder="Icono (emoji o clase CSS)"
          value={form.icon}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Destacada
        </label>
        <ButtonPrimary onClick={onAddCategory} aria-label={`Añadir categoría`}>
          Añadir categoría
        </ButtonPrimary>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddCategoryPage;
