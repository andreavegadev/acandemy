import { getOrderTagType, STATUS_LABELS } from "../constants/order";
import { ButtonLink } from "./Button";
import Heading from "./Heading";
import { Stack } from "./LayoutUtilities";
import Price from "./Price";
import { RowList, Row } from "./Row";
import Tag from "./Tag";

const LastOrdersList = ({ orders = [], limit = 3 }) => (
  <section>
    <Stack gap={24}>
      <Heading as="h2">Últimos pedidos</Heading>
      {orders.length > 0 ? (
        <RowList>
          {orders.slice(0, limit).map((order) => {
            return (
              <Row
                key={order.id}
                tag={
                  <Tag type={getOrderTagType(order.status)}>
                    {STATUS_LABELS[order.status] || order.status}
                  </Tag>
                }
                title={`Pedido ${order.id}`}
                subtitle={new Date(order.order_date).toLocaleDateString()}
                detail={<Price size={16} amount={order.total_amount} />}
                href={`/profile/orders/${order.id}`}
              />
            );
          })}
        </RowList>
      ) : (
        <p>No tienes pedidos recientes.</p>
      )}
      <ButtonLink href={`/profile/orders`} bleedLeft>
        Ver todos los pedidos
      </ButtonLink>
    </Stack>
  </section>
);

export default LastOrdersList;
