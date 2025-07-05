import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState(null); // "percentage" o "amount"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Opciones de envío
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  // Cargar opciones de envío activas
  useEffect(() => {
    const fetchShipping = async () => {
      const { data, error } = await supabase
        .from("shipping")
        .select("*")
        .eq("active", true)
        .order("price", { ascending: true });
      if (!error && data && data.length > 0) {
        setShippingOptions(data);
        setSelectedShipping(data[0].id);
      }
    };
    fetchShipping();
  }, []);

  useEffect(() => {
    if (cart.length === 0 && !success) {
      navigate("/cart", { replace: true });
    }
  }, [cart, success, navigate]);

  const getTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      let base = Number(item.price) || 0;
      if (item.personalizations && Array.isArray(item.personalizations)) {
        item.personalizations.forEach((p) => {
          if (p && p.additional_price) {
            base += Number(p.additional_price);
          }
        });
      }
      return sum + base * (item.quantity || 1);
    }, 0);

    let total = subtotal;
    if (discountApplied && discountValue > 0) {
      if (discountType === "Percentage") {
        total = subtotal - (subtotal * discountValue) / 100;
      } else if (discountType === "Amount") {
        total = Math.max(0, subtotal - discountValue);
      }
    }
    // Suma el precio del envío seleccionado
    const shipping = shippingOptions.find((s) => s.id === selectedShipping);
    if (shipping && shipping.price) {
      total += Number(shipping.price);
    }
    return total;
  };

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    setError("");
    setDiscountApplied(false);
    setDiscountValue(0);
    setDiscountType(null);

    const code = discountCode.trim().toUpperCase();
    if (!code) {
      setError("Introduce un código de descuento.");
      return;
    }

    // Consulta a la tabla discounts
    const { data, error: dbError } = await supabase
      .from("discounts")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .limit(1)
      .single();

    if (dbError || !data) {
      setError("Código de descuento no válido o inactivo.");
      return;
    }

    // Validaciones adicionales
    const now = new Date();
    if (data.start_date && new Date(data.start_date) > now) {
      setError("Este código aún no está activo.");
      return;
    }
    if (data.end_date && new Date(data.end_date) < now) {
      setError("Este código ya ha expirado.");
      return;
    }
    if (data.min_order && getTotal() < Number(data.min_order)) {
      setError(
        `El pedido mínimo para este descuento es de €${Number(
          data.min_order
        ).toFixed(2)}.`
      );
      return;
    }
    if (data.max_uses !== null && data.max_uses <= 0) {
      setError("Este código ya ha alcanzado el número máximo de usos.");
      return;
    }

    // Aplica el descuento
    if (data.type === "Percentage" && data.percentage) {
      setDiscountValue(data.percentage);
      setDiscountType("Percentage");
      setDiscountApplied(true);
      setError("");
    } else if (data.type === "Amount" && data.amount) {
      setDiscountValue(data.amount);
      setDiscountType("Amount");
      setDiscountApplied(true);
      setError("");
    } else {
      setError("El código de descuento no es válido.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // 1. Obtener usuario autenticado
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      setError("Debes iniciar sesión para finalizar la compra.");
      return;
    }

    // 2. Insertar pedido en orders
    let discountId = null;
    if (discountApplied && discountCode) {
      // Busca el id del descuento aplicado
      const { data: discountData } = await supabase
        .from("discounts")
        .select("id")
        .eq("code", discountCode.trim().toUpperCase())
        .single();
      discountId = discountData?.id || null;
    }

    // Busca el precio del envío seleccionado
    const shipping = shippingOptions.find((s) => s.id === selectedShipping);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userData.user.id,
          total_amount: getTotal(),
          discount_id: discountId,
          status: "pending",
          shipping_address: "", // Si tienes dirección, ponla aquí
          shipping_type: selectedShipping,
          // Puedes guardar el id o nombre del envío en otra columna si lo necesitas
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      setError("No se pudo crear el pedido.");
      return;
    }

    // Aquí va el insert en user_discount_uses si discountId existe
    if (discountId) {
      await supabase.from("user_discount_uses").insert([
        {
          user_id: userData.user.id,
          discount_id: discountId,
          order_id: order.id,
        },
      ]);
    }

    // 3. Insertar los items en order_items y actualizar stock
    for (const item of cart) {
      // Calcula el precio total sumando unit_price y el precio de las personalizaciones por cada unidad
      let unit_price = Number(item.price) || 0;
      let customizations_price = 0;

      if (item.personalizations && Array.isArray(item.personalizations)) {
        item.personalizations.forEach((p) => {
          if (p && p.additional_price) {
            customizations_price += Number(p.additional_price);
          }
        });
      }

      const customizations =
        item.personalizations && item.personalizations.length > 0
          ? item.personalizations.map((p) => ({
              type: p.type,
              name: p.name,
              additional_price: p.additional_price,
            }))
          : null;

      const { error: itemError } = await supabase.from("order_items").insert([
        {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: unit_price,
          total_price: (unit_price + customizations_price) * item.quantity,
          customizations,
        },
      ]);
      if (itemError) {
        setError("No se pudo añadir un producto al pedido.");
        return;
      }
    }

    setSuccess(true);
    clearCart();
    setTimeout(() => navigate("/"), 3000);
  };

  if (cart.length === 0 && !success) {
    return <p>Tu carrito está vacío.</p>;
  }

  return (
    <div className="checkout-page-container">
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
            key={item.cartLineId || item.id}
            style={{
              marginBottom: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 8,
            }}
          >
            <strong>{item.title || item.name}</strong> x{item.quantity} — €{" "}
            {Number(item.price).toFixed(2)}
            {item.personalizations && item.personalizations.length > 0 && (
              <ul style={{ margin: "6px 0 0 12px", padding: 0, fontSize: 15 }}>
                {item.personalizations.map((p, idx) => (
                  <li key={idx}>
                    {p.type ? <b>{p.type}:</b> : null} {p.name}
                    {p.additional_price > 0
                      ? ` (+${Number(p.additional_price).toFixed(2)}€)`
                      : ""}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Opciones de envío */}
      <form style={{ marginTop: 24, marginBottom: 12 }}>
        <label
          style={{
            fontWeight: 500,
            color: "#5e35b1",
            marginBottom: 8,
            display: "block",
          }}
        >
          Método de envío:
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selectedShipping === option.id}
                onChange={() => setSelectedShipping(option.id)}
              />
              <span>
                {option.name} — €{Number(option.price).toFixed(2)}
              </span>
            </label>
          ))}
        </div>
      </form>

      <form
        onSubmit={handleApplyDiscount}
        style={{ marginTop: 12, marginBottom: 12 }}
      >
        <label style={{ fontWeight: 500, color: "#5e35b1" }}>
          Código de descuento:
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Introduce tu código"
            style={inputStyle}
            disabled={discountApplied}
          />
          <button
            type="submit"
            style={{
              background: discountApplied ? "#bdbdbd" : "#5e35b1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: 600,
              cursor: discountApplied ? "not-allowed" : "pointer",
            }}
            disabled={discountApplied}
          >
            {discountApplied ? "Aplicado" : "Aplicar"}
          </button>
        </div>
        {discountApplied && (
          <div style={{ color: "#43a047", marginTop: 8 }}>
            ¡Descuento{" "}
            {discountType === "Percentage"
              ? `${discountValue}%`
              : `de €${discountValue}`}{" "}
            aplicado!
          </div>
        )}
        {error && <div style={{ color: "#e53935", marginTop: 8 }}>{error}</div>}
      </form>
      <h3>
        Total: €{getTotal().toFixed(2)}
        {discountApplied && (
          <span style={{ color: "#43a047", fontSize: 15, marginLeft: 8 }}>
            (descuento incluido)
          </span>
        )}
      </h3>
      <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
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
