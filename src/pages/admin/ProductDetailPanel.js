import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const ProductDetailPanel = ({ product, onClose, onEdit, onReloadProducts }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    setDeleting(true);
    setError("");
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);
    setDeleting(false);
    if (error) {
      setError("Error al eliminar el producto: " + error.message);
    } else {
      if (onReloadProducts) onReloadProducts();
      if (onClose) onClose();
    }
  };

  if (!product) return null;
  return (
    <div className="detail-panel">
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
          position: absolute;
          top: 12px;
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
        .detail-panel .close-btn {
          right: 12px;
        }
        .detail-panel .edit-btn {
          right: 90px;
        }
        .detail-panel .delete-btn {
          right: 180px;
          background: #e53935;
          color: #fff;
        }
        .detail-panel .delete-btn:hover {
          background: #b71c1c;
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <button className="close-btn" onClick={onClose}>
        Cerrar
      </button>
      <button className="edit-btn" onClick={() => onEdit(product)}>
        Editar
      </button>
      <button className="delete-btn" onClick={handleDelete} disabled={deleting}>
        {deleting ? "Eliminando..." : "Eliminar"}
      </button>
      <h3>Detalle producto #{product.id}</h3>
      <p>
        <b>Nombre:</b> {product.name}
      </p>
      <p>
        <b>Precio:</b> {Number(product.price).toFixed(2)} €
      </p>
      <p>
        <b>Stock:</b> {product.stock}
      </p>
      <p>
        <b>Ventas:</b> {product.sales_count ?? 0}
      </p>
      <p>
        <b>Activo:</b> {product.active ? "Sí" : "No"}
      </p>
      <p>
        <b>Hecho a mano:</b> {product.handmade ? "Sí" : "No"}
      </p>
      {error && <p style={{ color: "#e53935" }}>{error}</p>}
    </div>
  );
};

export default ProductDetailPanel;
