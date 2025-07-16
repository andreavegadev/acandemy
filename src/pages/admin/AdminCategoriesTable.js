import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Table from "../../components/Table";
import { Inline, Stack } from "../../components/LayoutUtilities";
import Heading from "../../components/Heading";
import { ButtonPrimary } from "../../components/Button";

const AdminCategoriesTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      let query = supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      const { data } = await query;
      setCategories(data || []);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const onAddCategory = () => {
    navigate("/admin/categories/add");
  };

  const onCategorySelect = (category) => {
    if (category && category.id) {
      navigate(`/admin/categories/${category.id}`);
    }
  };

  const categoryFilters = [
    { key: "name", label: "Buscar nombre", type: "text" },
    { key: "description", label: "Buscar descripción", type: "text" },
    {
      key: "featured",
      label: "Destacada",
      type: "select",
      options: [
        { value: "true", label: "Sí" },
        { value: "false", label: "No" },
      ],
    },
  ];

  return (
    <Stack gap={24}>
      <Inline justify="space-between" align="center" fullWidth>
        <Heading>Categorías</Heading>
        <ButtonPrimary onClick={onAddCategory}>Añadir categoría</ButtonPrimary>
      </Inline>
      <Table
        items={categories}
        onClick={onCategorySelect}
        filters={categoryFilters}
        addItems
      />
      {loading && <p>Cargando...</p>}
      {!loading && categories.length === 0 && <p>Sin categorías</p>}
    </Stack>
  );
};

export default AdminCategoriesTable;
