import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { STATUS_LABELS } from "../../constants/order";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        setLoading(false);
        return;
      }
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, order_date, total_amount, status")
        .eq("user_id", userId)
        .order("order_date", { ascending: false });
      setOrders(ordersData || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) return <p>Cargando pedidos...</p>;

  return (
    <div>
      {orders.length === 0 ? (
        <p>No tienes pedidos.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{Number(order.total_amount).toFixed(2)} €</td>
                <td>{STATUS_LABELS[order.status] || order.status}</td>
                <td>
                  <button onClick={() => handleViewOrderDetails(order.id)}>
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrdersPage;
