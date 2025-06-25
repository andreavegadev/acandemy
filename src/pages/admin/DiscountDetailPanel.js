import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const DiscountDetailPanel = ({ discount, onClose, onEdit, onReloadDiscounts }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este código descuento?")) return;
    setDeleting(true);
    setError("");
    const { error } = await supabase
      .from("discounts")
      .delete()
      .eq("id", discount.id);
    setDeleting(false);
    if (error) {
      setError("Error al eliminar el descuento: " + error.message);
    } else {
      if (onReloadDiscounts) onReloadDiscounts();
      if (onClose) onClose();
    }
  };

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
        .detail-panel button {
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
      `}</style>
      <div className="detail-panel">
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button onClick={onClose}>Cerrar</button>
          <button onClick={() => onEdit(discount)}>Editar</button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: "#e53935",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
        <h3>Detalle código descuento #{discount.id}</h3>
        <p>
          <b>Código:</b> {discount.code}
        </p>
        <p>
          <b>Tipo:</b> {discount.type}
        </p>
        <p>
          <b>Valor:</b> {discount.value}
        </p>
        <p>
          <b>Porcentaje:</b> {discount.percentage ? `${discount.percentage}%` : "-"}
        </p>
        <p>
          <b>Monto fijo:</b> {discount.fixed_amount ? `${discount.fixed_amount} €` : "-"}
        </p>
        <p>
          <b>Fecha inicio:</b> {discount.start_date ? new Date(discount.start_date).toLocaleDateString() : "-"}
        </p>
        <p>
          <b>Fecha fin:</b> {discount.end_date ? new Date(discount.end_date).toLocaleDateString() : "-"}
        </p>
        <p>
          <b>Usos máximos:</b> {discount.max_uses ?? "-"}
        </p>
        <p>
          <b>Usos realizados:</b> {discount.times_used ?? "-"}
        </p>
        <p>
          <b>Activo:</b> {discount.active ? "Sí" : "No"}
        </p>
        {error && <p style={{ color: "#e53935" }}>{error}</p>}
      </div>
    </div>
  );
};

export default DiscountDetailPanel;
