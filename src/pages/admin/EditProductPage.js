import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary } from "../../components/Button";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    const fetchData = async () => {
      const { data: product, error: prodError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name");
      if (prodError || !product) {
        setError("No se pudo cargar el producto.");
      } else {
        setForm(product);
      }
      setCategories(cats || []);
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
      .from("products")
      .update({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        category_id: Number(form.category_id),
      })
      .eq("id", id);
    if (error) {
      setError("Error al actualizar el producto: " + error.message);
    } else {
      setSuccess("Producto actualizado correctamente.");
      setTimeout(() => navigate(-1), 1200);
    }
  };

  return (
    <div className="add-product-page">
      <h1>Editar Producto</h1>
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
        <ButtonPrimary
          type="submit"
          aria-label={`Guardar cambios producto ${form.name}`}
        >
          Guardar cambios
        </ButtonPrimary>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default EditProductPage;
