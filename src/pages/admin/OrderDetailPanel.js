import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  STATUS_LABELS,
  PAYMENT_LABELS,
} from "../../constants/order";

const OrderDetailPanel = ({
  order,
  onClose,
  onStatusChange,
  onReloadOrder,
  onReloadOrders,
}) => {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleStatusUpdate = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);
    setSaving(false);
    if (error) {
      setError("Error al actualizar el estado");
    } else {
      if (onStatusChange) onStatusChange(newStatus);
      if (onReloadOrder) onReloadOrder(order.id); // <-- recarga el pedido
      if (onReloadOrders) onReloadOrders();
    }
  };

  // Lo mismo para el pago:
  const handlePaymentUpdate = async (e) => {
    const newPaymentStatus = e.target.value;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: newPaymentStatus })
      .eq("id", order.id);
    setSaving(false);
    if (error) {
      setError("Error al actualizar el pago");
    } else {
      if (onReloadOrder) onReloadOrder(order.id); // <-- recarga el pedido
      if (onReloadOrders) onReloadOrders();
    }
  };

  if (!order) return null;
  return (
    <div>
      <style>{`
        .detail-panel {
          background: #f8f6ff;
          border: 1px solid #d1c4e9;
          border-radius: 12px;
          padding: 24px 20px 20px 20px;
          min-width: 320px;
          max-width: 420px;
          min-height: 320px;
          box-shadow: 0 2px 12px #ede7f6;
          position: relative;
          font-size: 16px;
          color: #3a2e5c;
          margin-bottom: 16px;
          animation: fadeInDetail 0.3s;
        }
        .detail-panel h3 {
          margin-top: 0;
          margin-bottom: 18px;
          color: #5e35b1;
          font-size: 1.3em;
        }
        .detail-panel p {
          margin: 8px 0;
          line-height: 1.5;
        }
        .detail-panel table {
          margin-top: 10px;
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }
        .detail-panel th, .detail-panel td {
          border: 1px solid #d1c4e9;
          padding: 4px 8px;
          text-align: left;
        }
        .detail-panel th {
          background: #ede7f6;
          color: #5e35b1;
        }
        .detail-panel button {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ede7f6;
          border: none;
          color: #5e35b1;
          font-weight: bold;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .detail-panel button:hover {
          background: #d1c4e9;
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <div className="detail-panel">
        <button onClick={onClose} style={{ float: "right" }}>
          Cerrar
        </button>
        <h3>Detalle pedido #{order.id}</h3>
        <p>
          <b>Usuario:</b>{" "}
          {order.user ? (
            <>
              {order.user.full_name}
              {order.user.id_number && (
                <>
                  <br />
                  DNI: {order.user.id_number}
                </>
              )}
              {order.user.phone && (
                <>
                  <br />
                  Tel: {order.user.phone}
                </>
              )}
            </>
          ) : (
            order.user_id
          )}
        </p>
        <p>
          <b>Fecha:</b>{" "}
          {order.order_date ? new Date(order.order_date).toLocaleString() : "-"}
        </p>
        <p>
          <b>Total:</b> {Number(order.total_amount).toFixed(2)} €
        </p>
        <p>
          <b>Descuento:</b> {order.discount_id || "-"}
        </p>
        <p>
          <b>Estado:</b>{" "}
          <select
            value={status}
            onChange={handleStatusUpdate}
            disabled={saving}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid #d1c4e9",
              marginLeft: 8,
              background: "#fff",
              color: "#5e35b1",
              fontWeight: 600,
            }}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          {saving && (
            <span style={{ marginLeft: 8, color: "#888" }}>Guardando...</span>
          )}
          {error && (
            <span style={{ color: "#e53935", marginLeft: 8 }}>{error}</span>
          )}
        </p>
        <p>
          <b>Pago:</b>{" "}
          <select
            value={order.payment_status || "unpaid"}
            onChange={handlePaymentUpdate}
            disabled={saving}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid #d1c4e9",
              marginLeft: 8,
              background: "#fff",
              color: "#5e35b1",
              fontWeight: 600,
            }}
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PAYMENT_LABELS[s]}
              </option>
            ))}
          </select>
          {saving && (
            <span style={{ marginLeft: 8, color: "#888" }}>Guardando...</span>
          )}
          {error && (
            <span style={{ color: "#e53935", marginLeft: 8 }}>{error}</span>
          )}
        </p>
        <p>
          <b>Tracking:</b> {order.tracking_number || "-"}
        </p>
        <p>
          <b>Dirección envío:</b> {order.shipping_address || "-"}
        </p>
        <p>
          <b>Dirección facturación:</b> {order.billing_address || "-"}
        </p>
        <h4 style={{ marginTop: 16 }}>Productos</h4>
        {order.items && order.items.length === 0 ? (
          <p>No hay productos en este pedido.</p>
        ) : (
          <table style={{ width: "100%", fontSize: 14, marginTop: 8 }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio ud.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product?.name || item.product_id}</td>
                  <td>{item.quantity}</td>
                  <td>{Number(item.unit_price).toFixed(2)} €</td>
                  <td>{Number(item.total_price).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPanel;
