import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonDanger, ButtonSecondary } from "../../components/Button";

const CategoryDetailPanel = ({
  category,
  onClose,
  onEdit,
  onReloadCategories,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    setDeleting(true);
    setError("");
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);
    setDeleting(false);
    if (error) {
      setError("Error al eliminar la categoría: " + error.message);
    } else {
      if (onReloadCategories) onReloadCategories();
      if (onClose) onClose();
    }
  };

  if (!category) return null;
  return (
    <div className="detail-panel">
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <ButtonSecondary
          onClick={onClose}
          aria-label={`Cerrar categoria ${category.name}`}
        >
          Cerrar
        </ButtonSecondary>
        <ButtonSecondary
          onClick={() => onEdit(category)}
          aria-label={`Editar categoría ${category.name}`}
        >
          Editar
        </ButtonSecondary>
        <ButtonDanger
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Eliminar categoría ${category.name}`}
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </ButtonDanger>
      </div>
      <h3>Detalle categoría #{category.id}</h3>
      <p>
        <b>Nombre:</b> {category.name}
      </p>
      <p>
        <b>Descripción:</b> {category.description || "-"}
      </p>
      <p>
        <b>Icono:</b> {category.icon || "-"}
      </p>
      {error && <p style={{ color: "#e53935" }}>{error}</p>}
    </div>
  );
};

export default CategoryDetailPanel;
