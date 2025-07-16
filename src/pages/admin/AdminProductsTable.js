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

  // Calcula los destacados tipo "featuredItems"
  const featuredItems = [
    {
      label: "Sin stock",
      cantidad: products.filter((p) => p.stock === 0).length,
    },
    {
      label: "Stock bajo (<5, no personalizables)",
      cantidad: products.filter(
        (p) => p.stock > 0 && p.stock < 5 && !p.personalizable
      ).length,
    },
    {
      label: "Activos",
      cantidad: products.filter((p) => p.active).length,
    },
    {
      label: "Top ventas",
      cantidad: Array.isArray(topVentas) ? topVentas.length : 0,
    },
  ];

  return (
    <Stack gap={24}>
      <Inline justify="space-between" align="center" fullWidth>
        <Heading>Productos</Heading>
        <ButtonPrimary onClick={onAddProduct}>Añadir producto</ButtonPrimary>
      </Inline>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "24px",
          padding: "24px 0",
        }}
      >
        {featuredItems.map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid var(--purple30)",
              padding: "16px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#5e35b1",
                marginBottom: "8px",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#311b92",
              }}
            >
              {item.cantidad}
            </span>
          </div>
        ))}
      </section>
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
