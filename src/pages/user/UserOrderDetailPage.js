import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { STATUS_LABELS } from "../../constants/order";

const UserOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
            id,
            order_date,
            total_amount,
            status,
            shipping_address,
            billing_address,
            items:order_items (
              id,
              quantity,
              unit_price,
              total_price,
              product:products (
                id,
                name
              )
            )
          `
        )
        .eq("id", orderId)
        .single();
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Cargando detalle del pedido...</p>;
  if (!order) return <p style={{ textAlign: "center", marginTop: 40 }}>No se encontró el pedido.</p>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        background: "#f8f6ff",
        border: "1px solid #d1c4e9",
        borderRadius: 16,
        boxShadow: "0 2px 12px #ede7f6",
        padding: 32,
        fontSize: 16,
        color: "#3a2e5c",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 24,
          background: "#ede7f6",
          border: "none",
          color: "#5e35b1",
          fontWeight: "bold",
          padding: "6px 18px",
          borderRadius: 8,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseOver={e => (e.target.style.background = "#d1c4e9")}
        onMouseOut={e => (e.target.style.background = "#ede7f6")}
      >
        ← Volver
      </button>
      <h2 style={{ color: "#5e35b1", marginBottom: 12 }}>
        Detalle del pedido #{order.id}
      </h2>
      <div style={{ marginBottom: 18 }}>
        <p>
          <b>Fecha:</b>{" "}
          {order.order_date ? new Date(order.order_date).toLocaleString() : "-"}
        </p>
        <p>
          <b>Total:</b> <span style={{ color: "#43a047" }}>{Number(order.total_amount).toFixed(2)} €</span>
        </p>
        <p>
          <b>Estado:</b>{" "}
          <span
            style={{
              color:
                order.status === "pending"
                  ? "#fbc02d"
                  : order.status === "delivered"
                  ? "#43a047"
                  : order.status === "cancelled"
                  ? "#e53935"
                  : "#5e35b1",
              fontWeight: 600,
            }}
          >
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </p>
        <p>
          <b>Dirección de envío:</b> {order.shipping_address || "-"}
        </p>
        <p>
          <b>Dirección de facturación:</b> {order.billing_address || "-"}
        </p>
      </div>
      <h3 style={{ color: "#5e35b1", marginTop: 24 }}>Productos</h3>
      {order.items && order.items.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: 8,
            overflow: "hidden",
            marginTop: 8,
            marginBottom: 8,
            boxShadow: "0 1px 4px #ede7f6",
          }}
        >
          <thead>
            <tr style={{ background: "#ede7f6" }}>
              <th style={{ padding: 8, border: "1px solid #d1c4e9" }}>Producto</th>
              <th style={{ padding: 8, border: "1px solid #d1c4e9" }}>Cantidad</th>
              <th style={{ padding: 8, border: "1px solid #d1c4e9" }}>Precio ud.</th>
              <th style={{ padding: 8, border: "1px solid #d1c4e9" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: 8, border: "1px solid #d1c4e9" }}>
                  {item.product?.name || item.product_id}
                </td>
                <td style={{ padding: 8, border: "1px solid #d1c4e9" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: 8, border: "1px solid #d1c4e9" }}>
                  {Number(item.unit_price).toFixed(2)} €
                </td>
                <td style={{ padding: 8, border: "1px solid #d1c4e9" }}>
                  {Number(item.total_price).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos en este pedido.</p>
      )}
    </div>
  );
};

export default UserOrderDetailPage;
