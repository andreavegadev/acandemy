import styles from "./CheckoutPage.module.css";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";
import { Box, Stack } from "../../components/LayoutUtilities";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import Price from "../../components/Price";
import Input from "../../components/Input";
import { RadioButtonGroup } from "../../components/RadioButton";
import AsideLayout from "../../components/AsideLayout";

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
        <>
          El pedido mínimo para este descuento es de{" "}
          <Price amount={Number(data.min_order)} />.
        </>
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

  const shippingOptionsMapped = shippingOptions.map((option) => ({
    value: option.id,
    label: option.name,
    detail: <Price amount={option.price} size={16} />,
  }));

  if (cart.length === 0 && !success) {
    return <p>Tu carrito está vacío.</p>;
  }

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Stack gap={24}>
          <Breadcrumbs
            items={[
              { label: "Carrito", onClick: () => navigate("/cart") },
              {
                label: `Checkout`,
                current: true,
              },
            ]}
          ></Breadcrumbs>
          <Heading>Checkout</Heading>

          <AsideLayout
            aside={
              <Stack gap={16}>
                <Heading as="h2">Items ({cart.length})</Heading>
                <ul className={styles.cartItems}>
                  {cart.map((item) => (
                    <li
                      key={item.cartLineId || item.id}
                      className={`${styles.cartItem} ${
                        item.personalizations?.length ? styles.hasChildren : ""
                      }`}
                    >
                      <div className={styles.cartItemContent}>
                        <strong>
                          {item.title || item.name} x{item.quantity}
                        </strong>
                        <Price amount={Number(item.price)} size={16} />
                      </div>
                      {item.personalizations &&
                        item.personalizations.length > 0 && (
                          <ul>
                            {item.personalizations.map((p, idx) => (
                              <li key={idx}>
                                {p.type ? <b>{p.type}:</b> : null} {p.name}
                                {p.additional_price > 0 ? (
                                  <span>
                                    +
                                    <Price
                                      amount={p.additional_price}
                                      size={16}
                                    />
                                  </span>
                                ) : (
                                  ""
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>

                <Box paddingTop={24}>
                  <Heading as="h3">
                    Total: <Price amount={getTotal()}></Price>
                    {discountApplied && <span>(descuento incluido)</span>}
                  </Heading>
                </Box>
              </Stack>
            }
          >
            <div className={styles.content}>
              <Stack gap={24}>
                <section>
                  <Stack gap={16}>
                    <Heading as="h2">Opciones de envío</Heading>
                    <form>
                      <RadioButtonGroup
                        options={shippingOptionsMapped}
                        name="shipping"
                        selectedValue={selectedShipping}
                        onChange={setSelectedShipping}
                      />
                    </form>
                  </Stack>
                </section>
                <section>
                  <Stack gap={16}>
                    <Heading as="h2">Descuentos</Heading>
                    <form onSubmit={handleApplyDiscount}>
                      <Stack gap={8}>
                        <Input
                          label="Código de descuento"
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Introduce tu código"
                          disabled={discountApplied}
                        />
                        <ButtonSecondary
                          type="submit"
                          disabled={discountApplied}
                        >
                          {discountApplied ? "Aplicado" : "Aplicar"}
                        </ButtonSecondary>
                      </Stack>
                      {discountApplied && (
                        <div>
                          ¡Descuento{" "}
                          {discountType === "Percentage"
                            ? `${discountValue}%`
                            : `de €${discountValue}`}{" "}
                          aplicado!
                        </div>
                      )}
                      {error && <div>{error}</div>}
                    </form>
                  </Stack>
                </section>
              </Stack>
            </div>
          </AsideLayout>
          <section className={styles.checkoutSubmit}>
            <Stack gap={16}>
              <form onSubmit={handleSubmit}>
                <ButtonPrimary type="submit" fullWidth>
                  Finalizar compra ({getTotal().toFixed(2)}€)
                </ButtonPrimary>
                {success && (
                  <div>
                    ¡Compra realizada con éxito! Serás redirigido a la página
                    principal.
                  </div>
                )}
              </form>
            </Stack>
          </section>
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
};

export default CheckoutPage;
