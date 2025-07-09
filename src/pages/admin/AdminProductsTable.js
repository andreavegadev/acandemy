import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../../components/Button";
import Heading from "../../components/Heading";
import { Inline, Stack } from "../../components/LayoutUtilities";

const AdminProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState("name");
  const [orderAsc, setOrderAsc] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useState("all");
  const [handmadeFilter, setHandmadeFilter] = useState("all");
  const [topVentas, setTopVentas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      let countQuery = supabase
        .from("products")
        .select("id", { count: "exact" });

      if (filter === "active") {
        countQuery = countQuery.eq("active", true);
      } else if (filter === "inactive") {
        countQuery = countQuery.eq("active", false);
      }
      if (handmadeFilter === "yes") {
        countQuery = countQuery.eq("handmade", true);
      } else if (handmadeFilter === "no") {
        countQuery = countQuery.eq("handmade", false);
      }
      const { count } = await countQuery;
      setTotal(count || 0);

      let dataQuery = supabase
        .from("products")
        .select("id, name, price, stock, active, handmade, sales_count")
        .order(orderBy, { ascending: orderAsc });

      if (filter === "active") {
        dataQuery = dataQuery.eq("active", true);
      } else if (filter === "inactive") {
        dataQuery = dataQuery.eq("active", false);
      }
      if (handmadeFilter === "yes") {
        dataQuery = dataQuery.eq("handmade", true);
      } else if (handmadeFilter === "no") {
        dataQuery = dataQuery.eq("handmade", false);
      }

      const { data } = await dataQuery;

      setProducts(Array.isArray(data) ? data : []);
    };
    fetchProducts();
  }, [page, pageSize, filter, handmadeFilter, orderBy, orderAsc]);

  useEffect(() => {
    const fetchTopVentas = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, sales_count, stock")
        .order("sales_count", { ascending: false })
        .limit(3);
      setTopVentas(data || []);
    };
    fetchTopVentas();
  }, []);

  const onAddProduct = () => {
    navigate("/admin/products/add");
  };

  const onProductSelect = (product) => {
    if (product && product.id) {
      navigate(`/admin/products/${product.id}`);
    }
  };

  const destacados = [
    {
      title: "Top Ventas",
      items: Array.isArray(topVentas)
        ? topVentas.map((p) => ({
            id: p.id,
            title: p.name,
            description: `Ventas: ${p.sales_count ?? 0}`,
            url: `/product/${encodeURIComponent(p.name)}`,
          }))
        : [],
    },
    {
      title: "Stock bajo (< 5)",
      items: Array.isArray(products)
        ? products
            .filter((p) => p.stock > 0 && p.stock < 5)
            .map((p) => ({
              id: p.id,
              title: p.name,
              description: `Stock: ${p.stock}`,
              url: `/product/${encodeURIComponent(p.name)}`,
            }))
        : [],
    },
    {
      title: "Sin stock",
      items: Array.isArray(products)
        ? products
            .filter((p) => p.stock === 0)
            .map((p) => ({
              id: p.id,
              title: p.name,
              description: "Sin stock",
              url: `/product/${encodeURIComponent(p.name)}`,
            }))
        : [],
    },
  ];

  return (
    <Stack gap={24}>
      <Inline justify="space-between" align="center" fullWidth>
        <Heading>Productos</Heading>
        <ButtonPrimary onClick={onAddProduct}>Añadir producto</ButtonPrimary>
      </Inline>
      <Table
        items={products}
        onClick={onProductSelect}
        filters={[
          { key: "name", label: "Nombre" },
          { key: "price", label: "Precio mínimo", type: "number" },
          {
            key: "active",
            label: "Activo",
            type: "select",
            options: [
              { value: "true", label: "Sí" },
              { value: "false", label: "No" },
            ],
          },
          {
            key: "handmade",
            label: "Hecho a mano",
            type: "select",
            options: [
              { value: "true", label: "Sí" },
              { value: "false", label: "No" },
            ],
          },
        ]}
        addItems
      />
    </Stack>
  );
};

export default AdminProductsTable;
