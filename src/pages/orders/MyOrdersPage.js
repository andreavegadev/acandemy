import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

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
      const { data: { user } } = await supabase.auth.getUser();
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

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Cargando pedidos...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #ede7f6", padding: 32, position: "relative" }}>
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
      <h2 style={{ color: "#5e35b1", marginBottom: 24, textAlign: "center" }}>Mis pedidos</h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>No tienes pedidos aún.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#ede7f6", color: "#5e35b1" }}>
              <th style={{ padding: 10, borderRadius: 6 }}>ID</th>
              <th style={{ padding: 10 }}>Fecha</th>
              <th style={{ padding: 10 }}>Estado</th>
              <th style={{ padding: 10 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{order.id}</td>
                <td style={{ padding: 10 }}>{new Date(order.created_at).toLocaleString()}</td>
                <td style={{ padding: 10 }}>{order.status}</td>
                <td style={{ padding: 10 }}>{order.total ? `€${order.total.toFixed(2)}` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrdersPage;