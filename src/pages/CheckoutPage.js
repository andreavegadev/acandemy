import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // NUEVO: Precargar datos de usuario
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Carga email de auth
        let newForm = { ...form, email: user.email || "" };

        // Carga datos extra de la tabla public.user
        const { data: userData } = await supabase
          .from("user")
          .select("full_name, address, phone")
          .eq("id", user.id)
          .single();

        if (userData) {
          newForm = {
            ...newForm,
            full_name: userData.full_name || "",
            address: userData.address || "",
            phone: userData.phone || "",
          };
        }
        setForm(newForm);
      }
    };
    fetchUserData();
    // eslint-disable-next-line
  }, []);

  const getTotal = () =>
    cart.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity || 1),
      0
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación simple
    if (!form.full_name || !form.email || !form.address || !form.phone) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError("");
    setSuccess(true);
    clearCart();
    setTimeout(() => navigate("/"), 3000);
  };

  if (cart.length === 0 && !success) {
    return <p>Tu carrito está vacío.</p>;
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <button
        onClick={() => navigate("/cart")}
        style={{
          background: "#ede7f6",
          color: "#5e35b1",
          border: "none",
          borderRadius: 8,
          padding: "8px 18px",
          fontWeight: 600,
          marginBottom: 24,
          cursor: "pointer",
        }}
      >
        ← Volver al carrito
      </button>
      <h1 style={{ color: "#5e35b1" }}>Finalizar compra</h1>
      <h2>Resumen del pedido</h2>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {cart.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 8,
            }}
          >
            <strong>{item.title || item.name}</strong> x{item.quantity} — €{" "}
            {Number(item.price).toFixed(2)}
          </li>
        ))}
      </ul>
      <h3>Total: €{getTotal().toFixed(2)}</h3>
      <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
        <h2>Datos de envío</h2>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            name="full_name"
            placeholder="Nombre completo"
            value={form.full_name}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            name="address"
            placeholder="Dirección de envío"
            value={form.address}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        {error && (
          <div style={{ color: "#e53935", marginBottom: 12 }}>{error}</div>
        )}
        <button
          type="submit"
          style={{
            background: "#5e35b1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Finalizar compra
        </button>
        {success && (
          <div style={{ color: "#43a047", marginTop: 18 }}>
            ¡Compra realizada con éxito! Serás redirigido a la página principal.
          </div>
        )}
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #d1c4e9",
  fontSize: 16,
};

export default CheckoutPage;
