import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  ORDER_STATUSES,
  STATUS_LABELS,
  PAYMENT_LABELS,
} from "../../constants/order";

const AdminOrdersTable = ({ onOrderSelect, reloadFlag }) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState("order_date");
  const [orderAsc, setOrderAsc] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [orderUser, setOrderUser] = useState(null);
  const [reloadFlagState, setReloadFlag] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      // Conteo total con filtros
      let countQuery = supabase.from("orders").select("id", { count: "exact" });
      if (statusFilter.length > 0)
        countQuery = countQuery.in("status", statusFilter);
      if (paymentStatusFilter !== "all")
        countQuery = countQuery.eq("payment_status", paymentStatusFilter);
      if (search.length > 1) {
        countQuery = countQuery.or(
          `id::text.ilike.%${search}%,user_id.ilike.%${search}%,tracking_number.ilike.%${search}%,shipping_address.ilike.%${search}%,billing_address.ilike.%${search}%`
        );
      }
      const { count } = await countQuery;
      setTotal(count || 0);

      // Consulta de datos con filtros y paginación
      let dataQuery = supabase
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
            user:users (full_name, id_number)
          `
        )
        .order(orderBy, { ascending: orderAsc });

      if (statusFilter.length > 0)
        dataQuery = dataQuery.in("status", statusFilter);
      if (paymentStatusFilter !== "all")
        dataQuery = dataQuery.eq("payment_status", paymentStatusFilter);
      if (search.length > 1) {
        dataQuery = dataQuery.or(
          `id::text.ilike.%${search}%,user_id.ilike.%${search}%,tracking_number.ilike.%${search}%,shipping_address.ilike.%${search}%,billing_address.ilike.%${search}%`
        );
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data } = await dataQuery.range(from, to);

      setOrders(data || []);
    };
    fetchOrders();
  }, [
    page,
    orderBy,
    orderAsc,
    pageSize,
    statusFilter,
    paymentStatusFilter,
    search,
    reloadFlag,
  ]);

  const handleHeaderClick = (col) => {
    if (orderBy === col) {
      setOrderAsc((asc) => !asc);
    } else {
      setOrderBy(col);
      setOrderAsc(true);
    }
  };

  const handleDoubleClick = async (order) => {
    // Carga el detalle del pedido y los items como antes
    setOrderDetailLoading(true);
    setSelectedOrder(order);

    const { data: items } = await supabase
      .from("order_items")
      .select("*, product:product_id(name)")
      .eq("order_id", order.id);
    setOrderItems(items || []);

    let user = null;
    if (order.user_id) {
      const { data: userData } = await supabase
        .from("users")
        .select("id, full_name, phone, id_number")
        .eq("id", order.user_id)
        .single();
      user = userData;
    }
    setOrderUser(user);

    setOrderDetailLoading(false);

    // Llama al callback para mostrar el detalle en el panel derecho
    if (onOrderSelect) {
      onOrderSelect({
        ...order,
        items: items || [],
        user: user,
      });
    }
  };

  const handleClearFilters = () => {
    setOrderBy("order_date");
    setOrderAsc(false);
    setPage(1);
    setPageSize(5);
    setStatusFilter([]);
    setPaymentStatusFilter("all");
    setSearch("");
  };

  // Calcula el total y el conteo por estado
  const totalPedidos = orders.length;
  const pedidosPorEstado = ORDER_STATUSES.reduce((acc, estado) => {
    acc[estado] = orders.filter((o) => o.status === estado).length;
    return acc;
  }, {});

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <div style={{ flex: 2 }}>
        <h2>Pedidos</h2>
        {/* Resumen de estadísticas */}
        <div
          style={{
            marginBottom: 16,
            background: "#ede7f6",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <b>Total pedidos:</b> {totalPedidos}
          <span style={{ marginLeft: 24 }}>
            {ORDER_STATUSES.map((estado) => (
              <span key={estado} style={{ marginRight: 18 }}>
                <b>{STATUS_LABELS[estado]}:</b> {pedidosPorEstado[estado]}
              </span>
            ))}
          </span>
        </div>
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <label>
            Estado:&nbsp;
            <select
              multiple
              value={statusFilter}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (opt) => opt.value
                );
                setStatusFilter(selected);
                setPage(1);
              }}
              style={{ minWidth: 120, height: 90 }}
            >
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </label>
          <label>
            Pago:&nbsp;
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Todos</option>
              <option value="unpaid">No pagado</option>
              <option value="paid">Pagado</option>
              <option value="failed">Fallido</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </label>
          <input
            type="text"
            placeholder="Buscar por ID, usuario, tracking, dirección..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ minWidth: 180 }}
          />
          <label>
            Ver&nbsp;
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            &nbsp;por página
          </label>
          <button onClick={handleClearFilters}>Limpiar filtros</button>
        </div>
        <table className="admin-products-table">
          <thead>
            <tr>
              <th onClick={() => handleHeaderClick("id")}>
                ID {orderBy === "id" ? (orderAsc ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleHeaderClick("user_id")}>
                Usuario {orderBy === "user_id" ? (orderAsc ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleHeaderClick("order_date")}>
                Fecha {orderBy === "order_date" ? (orderAsc ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleHeaderClick("total_amount")}>
                Total {orderBy === "total_amount" ? (orderAsc ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleHeaderClick("discount_id")}>
                Descuento
              </th>
              <th onClick={() => handleHeaderClick("status")}>
                Estado {orderBy === "status" ? (orderAsc ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleHeaderClick("payment_status")}>
                Pago{" "}
                {orderBy === "payment_status" ? (orderAsc ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleHeaderClick("tracking_number")}>
                Tracking
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} onDoubleClick={() => handleDoubleClick(order)}>
                <td>{order.id}</td>
                <td>
                  {order.user
                    ? `${order.user.full_name} (DNI: ${order.user.id_number})`
                    : order.user_id}
                </td>
                <td>
                  {order.order_date
                    ? new Date(order.order_date).toLocaleString()
                    : "-"}
                </td>
                <td>{Number(order.total_amount).toFixed(2)} €</td>
                <td>{order.discount_id || "-"}</td>
                <td>{STATUS_LABELS[order.status]}</td>
                <td>{PAYMENT_LABELS[order.payment_status]}</td>
                <td>{order.tracking_number || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "1em" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span style={{ margin: "0 1em" }}>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
        <style>{`
          .admin-products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1em;
          }
          .admin-products-table th, .admin-products-table td {
            border: 1px solid #d1c4e9;
            padding: 8px 12px;
            text-align: left;
          }
          .admin-products-table th {
            background: #ede7f6;
            cursor: pointer;
            user-select: none;
          }
          .admin-products-table tr:hover {
            background: #f3e5f5;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminOrdersTable;
