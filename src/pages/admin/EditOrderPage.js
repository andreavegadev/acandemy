import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Heading from "../../components/Heading";
import Table from "../../components/Table";
import Input from "../../components/Input";
import { STATUS_LABELS } from "../../constants/order";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Stack } from "../../components/LayoutUtilities";
import Price from "../../components/Price";
import { ButtonSecondary } from "../../components/Button";
import Select from "../../components/Select";

const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(
          "id, product_id, quantity, unit_price, total_price, customizations, products(name)"
        )
        .eq("order_id", id);

      // Recuperar datos del usuario
      let userFullName = "";
      let userPhone = "";
      if (orderData?.user_id) {
        const { data: userData } = await supabase
          .from("users")
          .select("full_name, phone")
          .eq("id", orderData.user_id)
          .single();
        userFullName = userData?.full_name || "";
        userPhone = userData?.phone || "";
      }

      if (orderError || itemsError) {
        setError("No se pudo cargar el pedido.");
      } else {
        setOrder(orderData);
        setStatus(orderData.status);
        setItems(itemsData || []);
        setUserFullName(userFullName);
        setUserPhone(userPhone);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
    setUpdating(false);
    if (updateError) {
      setError("No se pudo actualizar el estado.");
    } else {
      setOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const handlePrintAddress = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Dirección de envío</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            h2 { color: #5e35b1; }
            .address-block { 
              border: 2px solid #b39ddb; 
              border-radius: 12px; 
              padding: 24px 18px; 
              font-size: 1.15em; 
              background: #f8f6ff;
              margin-top: 24px;
              max-width: 420px;
            }
          </style>
        </head>
        <body>
          <h2>Dirección de envío del pedido #${order.id}</h2>
          <div class="address-block">
            <b>Nombre:</b> ${userFullName || "-"}<br/>
            <b>Teléfono:</b> ${userPhone || "-"}<br/>

            </br></br>
            <b>Dirección:</b> ${
              order.shipping_address
                ? order.shipping_address.replace(/\n/g, "<br/>")
                : "-"
            }
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>Pedido no encontrado.</p>;

  const productTableItems = items.map((item) => ({
    id: item.id,
    product: item.products?.name || item.product_id,
    quantity: item.quantity,
    unit_price: Number(item.unit_price).toFixed(2) + " €",
    total_price: Number(item.total_price).toFixed(2) + " €",
    customizations: item.customizations
      ? JSON.stringify(item.customizations, null, 2)
      : "-",
  }));

  return (
    <Stack gap={24}>
      {" "}
      <Breadcrumbs
        items={[
          { label: "Pedidos", onClick: () => navigate("/admin/orders") },
          {
            label: `Pedido #${order.id}`,
            current: true,
          },
        ]}
      ></Breadcrumbs>
      <Heading as="h1">Pedido #{order.id}</Heading>
      <form onSubmit={onSubmit}>
        <Stack gap={16}>
          <Input
            label="Usuario"
            type="text"
            value={userFullName || order?.user_id}
            readOnly
            style={{ marginLeft: 8, width: 220 }}
          />

          <Input
            label="Teléfono"
            type="text"
            value={userPhone}
            readOnly
            style={{ marginLeft: 8, width: 220 }}
          />

          <Input
            label="Fecha de pedido"
            type="text"
            value={new Date(
              order.order_date || order.created_at
            ).toLocaleString()}
            readOnly
          />
          <Select
            label="Estado"
            name="status"
            value={status}
            onChange={handleStatusChange}
            disabled={updating}
            style={{ marginLeft: 8, marginRight: 8, width: 220 }}
            options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />

          <Input
            label={"Dirección de envío"}
            type="text"
            value={order.shipping_address}
            readOnly
          />
          <ButtonSecondary
            type="button"
            onClick={handlePrintAddress}
            aria-label={"Imprimir dirección de envío en nueva pestaña"}
          >
            Imprimir dirección
          </ButtonSecondary>
          <Input
            label={"Número de seguimiento"}
            type="text"
            value={order.tracking_number || ""}
            onChange={(e) => {
              const newTracking = e.target.value;
              setOrder((prev) => ({
                ...prev,
                tracking_number: newTracking,
              }));
            }}
            onBlur={async (e) => {
              const newTracking = e.target.value;
              setUpdating(true);
              const { error: updateError } = await supabase
                .from("orders")
                .update({ tracking_number: newTracking })
                .eq("id", id);
              setUpdating(false);
              if (updateError)
                setError("No se pudo actualizar el número de seguimiento.");
            }}
            disabled={updating}
            placeholder="-"
          />
          <Price amount={order.total_amount} />
        </Stack>
      </form>
      <Heading as="h2">Productos del pedido</Heading>
      <Table title="" items={productTableItems} />
    </Stack>
  );
};

export default EditOrderPage;
