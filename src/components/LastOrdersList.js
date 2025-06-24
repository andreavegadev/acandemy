import React from "react";
import { STATUS_LABELS } from "../constants/order";

const LastOrdersList = ({
  orders = [],
  onViewOrder,
  onViewAllOrders,
  limit = 5,
}) => (
  <section>
    <h2>Últimos pedidos</h2>
    {orders.length > 0 ? (
      <ul>
        {orders.slice(0, limit).map((order) => (
          <li key={order.id}>
            Pedido #{order.id} -{" "}
            {new Date(order.order_date).toLocaleDateString()} - $
            {order.total_amount} - {STATUS_LABELS[order.status] || order.status}
            <button onClick={() => onViewOrder(order.id)}>Ver Detalles</button>
          </li>
        ))}
      </ul>
    ) : (
      <p>No tienes pedidos recientes.</p>
    )}
    <button onClick={onViewAllOrders}>Ver todos los pedidos</button>
  </section>
);

export default LastOrdersList;
