import { STATUS_LABELS } from "../constants/order";
import { ButtonLink } from "./Button";

const cardStyle = {
  border: "1px solid #d1c4e9",
  borderRadius: 12,
  boxShadow: "0 1px 6px #ede7f6",
  padding: "16px 20px",
  marginBottom: 16,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const statusStyle = {
  fontWeight: 600,
  borderRadius: 8,
  padding: "2px 10px",
  fontSize: 13,
  display: "inline-block",
};

const LastOrdersList = ({ orders = [], limit = 5 }) => (
  <section>
    <h2 style={{ color: "#5e35b1", marginBottom: 16 }}>Últimos pedidos</h2>
    {orders.length > 0 ? (
      <div>
        {orders.slice(0, limit).map((order) => (
          <div key={order.id} style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600 }}>Pedido #{order.id}</span>
              <span
                style={{
                  ...statusStyle,
                  background:
                    order.status === "pending"
                      ? "#fffde7"
                      : order.status === "delivered"
                      ? "#e8f5e9"
                      : order.status === "cancelled"
                      ? "#ffebee"
                      : "#ede7f6",
                  color:
                    order.status === "pending"
                      ? "#fbc02d"
                      : order.status === "delivered"
                      ? "#43a047"
                      : order.status === "cancelled"
                      ? "#e53935"
                      : "#5e35b1",
                }}
              >
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <div style={{ fontSize: 15, color: "#3a2e5c" }}>
              <div>
                <b>Fecha:</b> {new Date(order.order_date).toLocaleDateString()}
              </div>
              <div>
                <b>Total:</b> {Number(order.total_amount).toFixed(2)} €
              </div>
            </div>
            <ButtonLink
              href={`/orders/${order.id}`}
              aria-label={`Ver detalle de pedido número ${order.id}`}
              bleedLeft
            >
              Ver detalles
            </ButtonLink>
          </div>
        ))}
      </div>
    ) : (
      <p>No tienes pedidos recientes.</p>
    )}
    <ButtonLink href={`/orders`} bleedLeft>
      Ver todos los pedidos
    </ButtonLink>
  </section>
);

export default LastOrdersList;
