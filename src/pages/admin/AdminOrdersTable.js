import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ORDER_STATUSES, STATUS_LABELS } from "../../constants/order";
import Table from "../../components/Table";
import Heading from "../../components/Heading";
import { Stack } from "../../components/LayoutUtilities";

const AdminOrdersTable = ({ onOrderSelect, reloadFlag }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [shippingTypes, setShippingTypes] = useState();

  // Cargar tipos de envío desde la tabla shipping
  useEffect(() => {
    const fetchShippingTypes = async () => {
      const { data, error } = await supabase
        .from("shipping")
        .select("id, name")
        .order("name", { ascending: true });
      if (data) {
        setShippingTypes([
          ...data.map((s) => ({
            value: String(s.id),
            label: s.name,
          })),
        ]);
      }
    };
    fetchShippingTypes();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      let { data } = await supabase
        .from("orders")
        .select(
          `
            id,
            user_id,
            order_date,
            total_amount,
            discount_id,
            status,
            payment_status,
            tracking_number,
            shipping_address,
            billing_address,
            shipping_type,
            user:users (full_name, id_number)
          `
        )
        .order("order_date", { ascending: false });
      setOrders(data || []);
    };
    fetchOrders();
  }, [reloadFlag]);

  // Filtros locales para frontend
  const [filters, setFilters] = useState({
    status: [],
    payment_status: "all",
    payment_method: "all",
    shipping_type: "all",
    discount: "",
    user: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  // Filtros para Table
  const tableFilters = [
    {
      key: "status",
      label: "Estado",
      type: "multiselect",
      value: filters.status,
      onChange: (e) => {
        const selected = Array.from(
          e.target.selectedOptions,
          (opt) => opt.value
        );
        setFilters((f) => ({ ...f, status: selected }));
      },
      options: ORDER_STATUSES.map((estado) => ({
        value: estado,
        label: STATUS_LABELS[estado],
      })),
    },
    {
      key: "payment_status",
      label: "Pago",
      type: "select",
      value: filters.payment_status,
      onChange: (e) =>
        setFilters((f) => ({ ...f, payment_status: e.target.value })),
      options: [
        { value: "unpaid", label: "No pagado" },
        { value: "paid", label: "Pagado" },
        { value: "failed", label: "Fallido" },
        { value: "refunded", label: "Reembolsado" },
      ],
    },
    {
      key: "shipping_type",
      label: "Tipo de envío",
      type: "select",
      value: filters.shipping_type,
      onChange: (e) =>
        setFilters((f) => ({ ...f, shipping_type: e.target.value })),
      options: shippingTypes,
    },
  ];

  // Click en fila
  const handleClick = (order) => {
    navigate(`/admin/orders/${order.id}`);
    if (onOrderSelect) onOrderSelect(order);
  };

  // Featured section: resumen de pedidos por estado
  const featuredItems = ORDER_STATUSES.map((status) => ({
    estado: STATUS_LABELS[status],
    cantidad: orders.filter((o) => o.status === status).length,
  }));

  return (
    <Stack gap={24}>
      <Heading>Pedidos</Heading>
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
            key={item.estado}
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
              {item.estado}
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
        filters={tableFilters}
        featuredItems={featuredItems}
        featuredTitle="Pedidos por estado"
        items={
          Array.isArray(orders)
            ? orders.map((order) => ({
                id: order.id,
                user: order.user
                  ? `${order.user.full_name} (DNI: ${order.user.id_number})`
                  : order.user_id,
                order_date: order.order_date
                  ? new Date(order.order_date).toLocaleString()
                  : "-",
                total_amount: Number(order.total_amount).toFixed(2) + " €",
                discount_id: order.discount_id || "-",
                shipping_type: order.shipping_type
                  ? String(order.shipping_type)
                  : "-",
                status: order.status,
                payment_status: order.payment_status,
                tracking_number: order.tracking_number || "-",
              }))
            : []
        }
        onClick={handleClick}
      />
    </Stack>
  );
};

export default AdminOrdersTable;
