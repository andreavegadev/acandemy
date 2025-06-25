import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState(null); // "percentage" o "amount"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity || 1),
      0
    );
    if (discountApplied && discountValue > 0) {
      if (discountType === "Percentage") {
        return subtotal - (subtotal * discountValue) / 100;
      } else if (discountType === "Amount") {
        return Math.max(0, subtotal - discountValue);
      }
    }
    return subtotal;
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

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userData.user.id,
          total_amount: getTotal(),
          discount_id: discountId,
          status: "pending",
          // NO pongas id aquí
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
      // Insertar en order_items
      const { error: itemError } = await supabase.from("order_items").insert([
        {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: Number(item.price) * item.quantity,
          // customizations: item.customizations, // solo si lo usas
        },
      ]);
      if (itemError) {
        setError("No se pudo añadir un producto al pedido.");
        return;
      }

      // Actualizar stock del producto
      // const { error: stockError } = await supabase
      //   .from("products")
      //   .update({
      //     stock: supabase.rpc("decrement_stock", {
      //       product_id: item.id,
      //       qty: item.quantity,
      //     }),
      //   })
      //   .eq("id", item.id);

      // Si no tienes una función RPC, usa este update:
      // .update({ stock: (item.stock || 0) - item.quantity })

      // if (stockError) {
      //   setError("No se pudo actualizar el stock de un producto.");
      //   return;
      // }
    }

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
      <form
        onSubmit={handleApplyDiscount}
        style={{ marginTop: 24, marginBottom: 12 }}
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
