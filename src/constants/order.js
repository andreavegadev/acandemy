export const ORDER_STATUSES = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

export const PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded"];

export const STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const PAYMENT_LABELS = {
  unpaid: "No pagado",
  paid: "Pagado",
  failed: "Fallido",
  refunded: "Reembolsado",
};

export function getOrderTagType(status) {
  switch (status) {
    case "pending":
      return "warning";
    case "delivered":
      return "success";
    case "cancelled":
      return "danger";
    case "shipped":
      return "success";
    default:
      return "info";
  }
}
