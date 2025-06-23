import React from "react";

const DiscountDetailPanel = ({ discount, onClose }) => {
  if (!discount) return null;
  return (
    <div>
      <style>{`
        .detail-panel {
          background: #f8f6ff;
          border: 1px solid #d1c4e9;
          border-radius: 12px;
          padding: 24px 20px 20px 20px;
          min-width: 320px;
          max-width: 420px;
          min-height: 320px;
          box-shadow: 0 2px 12px #ede7f6;
          position: relative;
          font-size: 16px;
          color: #3a2e5c;
          margin-bottom: 16px;
          animation: fadeInDetail 0.3s;
        }
        .detail-panel h3 {
          margin-top: 0;
          margin-bottom: 18px;
          color: #5e35b1;
          font-size: 1.3em;
        }
        .detail-panel p {
          margin: 8px 0;
          line-height: 1.5;
        }
        .detail-panel table {
          margin-top: 10px;
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }
        .detail-panel th, .detail-panel td {
          border: 1px solid #d1c4e9;
          padding: 4px 8px;
          text-align: left;
        }
        .detail-panel th {
          background: #ede7f6;
          color: #5e35b1;
        }
        .detail-panel button {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ede7f6;
          border: none;
          color: #5e35b1;
          font-weight: bold;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .detail-panel button:hover {
          background: #d1c4e9;
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <div className="detail-panel">
        <button onClick={onClose} style={{ float: "right" }}>
          Cerrar
        </button>
        <h3>Detalle código: {discount.code}</h3>
        <p>
          <b>Descripción:</b> {discount.description || "-"}
        </p>
        <p>
          <b>Tipo:</b>{" "}
          {discount.type === "Percentage" ? "Porcentaje" : "Importe fijo"}
        </p>
        <p>
          <b>Valor:</b>{" "}
          {discount.type === "Percentage"
            ? `${discount.percentage}%`
            : `${discount.amount} €`}
        </p>
        <p>
          <b>Pedido mínimo:</b>{" "}
          {discount.min_order ? `${discount.min_order} €` : "-"}
        </p>
        <p>
          <b>Máx. usos:</b> {discount.max_uses || "-"}
        </p>
        <p>
          <b>Válido desde:</b>{" "}
          {discount.start_date
            ? new Date(discount.start_date).toLocaleString()
            : "-"}
        </p>
        <p>
          <b>Válido hasta:</b>{" "}
          {discount.end_date ? new Date(discount.end_date).toLocaleString() : "-"}
        </p>
        <p>
          <b>Activo:</b> {discount.active ? "Sí" : "No"}
        </p>
        <p>
          <b>Usuario asignado:</b> {discount.user_id || "General"}
        </p>
      </div>
    </div>
  );
};

export default DiscountDetailPanel;
