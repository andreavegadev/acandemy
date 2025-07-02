import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

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

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      // Obtén el usuario en sesión
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("No hay sesión activa.");
        setLoading(false);
        return;
      }
      // Consulta los pedidos del usuario
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) setError("No se pudieron cargar los pedidos.");
      else setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Cargando pedidos...
      </div>
    );
  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        {error}
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #ede7f6",
        padding: 32,
        position: "relative",
      }}
    >
      <button
        onClick={() => navigate("/profile")}
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          background: "#ede7f6",
          color: "#5e35b1",
          border: "none",
          borderRadius: 8,
          padding: "8px 18px",
          fontSize: "1em",
          fontWeight: 500,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        ← Volver
      </button>
      <h2 style={{ color: "#5e35b1", marginBottom: 24, textAlign: "center" }}>
        Mis pedidos
      </h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>
          No tienes pedidos aún.
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
                  {order.status}
                </span>
              </div>
              <div style={{ fontSize: 15, color: "#3a2e5c" }}>
                <div>
                  <b>Fecha:</b> {new Date(order.created_at).toLocaleString()}
                </div>
                <div>
                  <b>Total:</b>{" "}
                  {order.total_amount
                    ? `€${order.total_amount.toFixed(2)}`
                    : "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
