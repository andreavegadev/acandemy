import { useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  STATUS_LABELS,
  PAYMENT_LABELS,
} from "../../constants/order";
import Input from "../../components/Input";
import { ButtonSecondary } from "../../components/Button";
import Price from "../../components/Price";
import Select from "../../components/Select";

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
      <div className="detail-panel">
        <ButtonSecondary
          onClick={onClose}
          aria-label={`Cerrar detalle pedido ${order.id}`}
        >
          Cerrar
        </ButtonSecondary>
        <h3>Detalle pedido #{order.id}</h3>
        <p>
          <Input
            type="text"
            value={
              order.user
                ? `${order.user.full_name || ""}${
                    order.user.id_number ? `\nDNI: ${order.user.id_number}` : ""
                  }${order.user.phone ? `\nTel: ${order.user.phone}` : ""}`
                : order.user_id
            }
            readOnly
            label="Usuario"
          />
        </p>
        <Input
          type="text"
          value={
            order.order_date ? new Date(order.order_date).toLocaleString() : "-"
          }
          readOnly
          label="Fecha de pedido"
        ></Input>
        <Input
          type="text"
          value={<Price amount={order.total_amount}></Price>}
          readOnly
          label="Total:"
        ></Input>

        <p>
          <b>Descuento:</b> {order.discount_id || "-"}
        </p>
        <p>
          <Select
            label="Estado"
            value={status}
            onChange={handleStatusUpdate}
            disabled={saving}
            options={ORDER_STATUSES.map((s) => ({
              value: s,
              label: STATUS_LABELS[s],
            }))}
          />
          {saving && (
            <span style={{ marginLeft: 8, color: "#888" }}>Guardando...</span>
          )}
          {error && (
            <span style={{ color: "#e53935", marginLeft: 8 }}>{error}</span>
          )}
        </p>
        
          <Select
            label={`Pago`}
            value={order.payment_status || "unpaid"}
            onChange={handlePaymentUpdate}
            disabled={saving}
            options={PAYMENT_STATUSES.map((s) => ({
              value: s,
              label: PAYMENT_LABELS[s],
            }))}
          />
          {saving && (
            <span style={{ marginLeft: 8, color: "#888" }}>Guardando...</span>
          )}
          {error && (
            <span style={{ color: "#e53935", marginLeft: 8 }}>{error}</span>
          )}
        
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
                <th>Personalizaciones</th>
                <th>Cantidad</th>
                <th>Precio ud.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product?.name || item.product_id}</td>
                  <td>
                    {item.customizations && item.customizations.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                        {item.customizations.map((p, idx) => (
                          <li key={idx}>
                            {p.type ? <b>{p.type}:</b> : null} {p.name}
                            {p.additional_price > 0
                              ? ` (+${Number(p.additional_price).toFixed(2)}€)`
                              : ""}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
                  </td>
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
