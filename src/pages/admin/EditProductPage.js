import Table from "../../components/Table";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Input from "../../components/Input";
import {
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
} from "../../components/Button";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { Box, Stack } from "../../components/LayoutUtilities";
import TextArea from "../../components/TextArea";
import Select from "../../components/Select";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = !location.pathname.endsWith("/edit");

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

  const [personalizations, setPersonalizations] = useState([]);

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

  useEffect(() => {
    const fetchPersonalizations = async () => {
      if (!form.id) return;
      const { data } = await supabase
        .from("personalizations")
        .select("*, personalization_type:personalization_types(*)")
        .eq("product_id", form.id);
      setPersonalizations(data || []);
    };
    fetchPersonalizations();
  }, [form.id]);

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

  const handleEdit = () => {
    navigate(`/admin/products/${id}/edit`);
  };

  // Navegar al detalle de una personalización
  const selectPersonalization = useCallback(
    (row) => {
      if (row && row.id) {
        navigate(`/admin/products/customizations/${row.id}`);
      }
    },
    [navigate]
  );

  const addPersonalization = useCallback(() => {
    navigate(`/admin/products/customizations/add?product_id=${form.id}`);
  }, [navigate, form.id]);

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    setError("");
    setSuccess("");
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      setError("Error al eliminar el producto: " + error.message);
    } else {
      setSuccess("Producto eliminado correctamente.");
      setTimeout(() => navigate("/admin/products"), 1200);
    }
  };

  return (
    <Box paddingY={24}>
      <Stack gap={24}>
        {" "}
        <Breadcrumbs
          items={[
            {
              label: "Productos",
              onClick: () => navigate("/admin/products"),
            },
            {
              label: form.name ? form.name : "Producto",
              href: `/admin/products/${form.id}`,
              current: true,
            },
          ]}
        ></Breadcrumbs>
        <Heading>
          {isViewMode ? "Detalle del" : "Editar "}{" "}
          {form.name.toLocaleLowerCase() || "Producto"}
        </Heading>
        <form className="edit-product-form" onSubmit={handleSubmit}>
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
              name="description"
              label="Descripción"
              value={form.description}
              onChange={handleChange}
              required
              disabled={isViewMode}
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
              disabled={isViewMode}
            />
            €
            <Input
              type="number"
              name="stock"
              label="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              disabled={isViewMode}
            />
            <Select
              name="category_id"
              label="Categoría"
              value={form.category_id}
              onChange={handleChange}
              required
              disabled={isViewMode}
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
              disabled={isViewMode}
            />
            <Input
              label={"Hecho a mano"}
              type="checkbox"
              name="handmade"
              checked={form.handmade}
              onChange={handleChange}
              disabled={isViewMode}
            />
            {!isViewMode && (
              <div className="button-group">
                <ButtonPrimary
                  type="submit"
                  aria-label={`Guardar cambios producto ${form.name}`}
                >
                  Guardar cambios
                </ButtonPrimary>
                <ButtonSecondary
                  aria-label={`Cancelar edición producto ${form.name}`}
                  onClick={() => navigate(`/admin/products/${form.id}`)}
                >
                  Cancelar
                </ButtonSecondary>
              </div>
            )}
            {isViewMode && form.product_images && (
              <img src={form.product_images[0]?.src} alt={form.name} />
            )}
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
          </Stack>
        </form>
        <div>
          {isViewMode && (
            <>
              <ButtonPrimary
                onClick={handleEdit}
                style={{ background: "#5e35b1" }}
              >
                Editar
              </ButtonPrimary>
              <ButtonDanger
                type="button"
                onClick={handleDelete}
                style={{ marginLeft: 8 }}
              >
                Eliminar
              </ButtonDanger>
            </>
          )}
        </div>
        <Table
          title={`Personalizaciones`}
          items={personalizations.map((p) => ({
            id: p.id,
            nombre: p.name,
            tipo: p.personalization_type?.name || "-",
            precio_extra: Number(p.additional_price).toFixed(2) + " €",
            activa: p.active ? "Sí" : "No",
            descripcion: p.description || "-",
          }))}
          onClick={selectPersonalization}
          onClickAdd={addPersonalization}
          addItems
        />
      </Stack>
    </Box>
  );
};

export default EditProductPage;
