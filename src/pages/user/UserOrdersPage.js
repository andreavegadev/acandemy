import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { STATUS_LABELS } from "../../constants/order";

const cardStyle = {
  border: "1px solid #d1c4e9",
  borderRadius: 12,
  boxShadow: "0 1px 6px #ede7f6",
  padding: "18px 24px",
  marginBottom: 18,
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

const buttonStyle = {
  background: "#ede7f6",
  border: "none",
  color: "#5e35b1",
  fontWeight: "bold",
  padding: "6px 16px",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 8,
  alignSelf: "flex-start",
  transition: "background 0.2s",
};

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

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2
        style={{
          color: "#5e35b1",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Mis pedidos
      </h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>
          No tienes pedidos.
        </div>
      ) : (
        <div>
          {orders.map((order) => (
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
                  <b>Fecha:</b>{" "}
                  {new Date(order.order_date).toLocaleDateString()}
                </div>
                <div>
                  <b>Total:</b> {Number(order.total_amount).toFixed(2)} €
                </div>
              </div>
              <button
                style={buttonStyle}
                onMouseOver={(e) => (e.target.style.background = "#d1c4e9")}
                onMouseOut={(e) => (e.target.style.background = "#ede7f6")}
                onClick={() => handleViewOrderDetails(order.id)}
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
