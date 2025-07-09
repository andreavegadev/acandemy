import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { getOrderTagType, STATUS_LABELS } from "../../constants/order";
import Tag from "../../components/Tag";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import Table from "../../components/Table";
import Price from "../../components/Price";

const UserOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select(
          `
            id,
            order_date,
            total_amount,
            status,
            shipping_address,
            billing_address,
            items:order_items (
              id,
              quantity,
              unit_price,
              total_price,
              customizations,
              product:products (
                id,
                name
              )
            )
          `
        )
        .eq("id", orderId)
        .single();
      setOrder(data);
    };
    fetchOrder();
  }, [orderId]);

  if (!order)
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        No se encontró el pedido.
      </p>
    );

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Mi perfil", href: "/profile" },
          { label: "Mis pedidos", onClick: () => navigate("/profile/orders") },
          {
            label: `Pedido #${orderId}`,
            href: `/profile/orders/${orderId}`,
            current: true,
          },
        ]}
      />
      <Heading>Detalle del pedido #{order.id}</Heading>
      <div style={{ marginBottom: 18 }}>
        <p>
          <b>Fecha:</b>{" "}
          {order.order_date ? new Date(order.order_date).toLocaleString() : "-"}
        </p>
        <p>
          <b>Total:</b> <Price amount={Number(order.total_amount)} />
        </p>
        <p>
          <b>Estado:</b>{" "}
          <Tag type={getOrderTagType(order.status)}>
            {STATUS_LABELS[order.status] || order.status}
          </Tag>
        </p>
        <p>
          <b>Dirección de envío:</b> {order.shipping_address || "-"}
        </p>
        <p>
          <b>Dirección de facturación:</b> {order.billing_address || "-"}
        </p>
      </div>
      <Heading as="h3">Productos</Heading>
      {order.items && order.items.length > 0 ? (
        <Table
          title=""
          items={order.items.map((item) => ({
            producto: item.product?.name || item.product_id,
            personalizaciones:
              item.customizations && item.customizations.length > 0
                ? item.customizations
                    .map(
                      (p) =>
                        `${p.type ? p.type + ": " : ""}${p.name}${
                          p.additional_price > 0
                            ? ` (+${Number(p.additional_price).toFixed(2)}€)`
                            : ""
                        }`
                    )
                    .join(", ")
                : "—",
            cantidad: item.quantity,
            precio: `${Number(item.unit_price).toFixed(2)} €`,
            total: `${Number(item.total_price).toFixed(2)} €`,
          }))}
          filters={[]} // Sin filtros
          onClickAdd={null}
          onClick={null}
        />
      ) : (
        <p>No hay productos en este pedido.</p>
      )}
    </div>
  );
};

export default UserOrderDetailPage;
