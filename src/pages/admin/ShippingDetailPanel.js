import { useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
} from "../../components/Button";

const ShippingDetailPanel = ({ shipping, onClose, onReloadShipping }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: shipping?.name || "",
    price: shipping?.price || "",
    active: shipping?.active || false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    // Validación: el precio no puede ser negativo
    if (form.price === "" || isNaN(form.price) || Number(form.price) < 0) {
      setError("El precio debe ser un número mayor o igual a 0.");
      return;
    }
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("shipping")
      .update({
        name: form.name,
        price: Number(form.price),
        active: form.active,
      })
      .eq("id", shipping.id);
    setSaving(false);
    if (error) {
      setError("Error al actualizar: " + error.message);
    } else {
      setEditMode(false);
      if (onReloadShipping) onReloadShipping();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este tipo de envío?"))
      return;
    setDeleting(true);
    setError("");
    const { error } = await supabase
      .from("shipping")
      .delete()
      .eq("id", shipping.id);
    setDeleting(false);
    if (error) {
      setError("Error al eliminar: " + error.message);
    } else {
      if (onReloadShipping) onReloadShipping();
      if (onClose) onClose();
    }
  };

  if (!shipping) return null;
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
          min-height: 220px;
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
        .detail-panel label {
          display: block;
          margin: 8px 0 4px 0;
          font-weight: 500;
        }
        .detail-panel input[type="text"],
        .detail-panel input[type="number"] {
          width: 100%;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #d1c4e9;
          font-size: 15px;
          margin-bottom: 8px;
        }
        .detail-panel input[type="checkbox"] {
          accent-color: #5e35b1;
        }
        .detail-panel .panel-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }
        .detail-panel .danger {
          background: #e53935 !important;
          color: #fff !important;
        }
      `}</style>
      <div className="detail-panel">
        <div className="panel-actions">
          <ButtonSecondary
            onClick={onClose}
            aria-label={`Cerrar tipo de envío ${shipping.name}`}
          >
            Cerrar
          </ButtonSecondary>
          {!editMode && (
            <ButtonSecondary
              onClick={() => setEditMode(true)}
              aria-label={`Editar tipo de envío ${shipping.name}`}
            >
              Editar
            </ButtonSecondary>
          )}
          <ButtonDanger
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Eliminar tipo de envío ${shipping.name}`}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </ButtonDanger>
        </div>
        <h3>Detalle tipo de envío #{shipping.id}</h3>
        {editMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label>Precio (€):</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
            <label>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />{" "}
              Activo
            </label>
            <div style={{ marginTop: 12 }}>
              <ButtonPrimary
                type="submit"
                disabled={saving}
                aria-label={`Guardar tipo de envío ${shipping.name}`}
              >
                {saving ? "Guardando..." : "Guardar"}
              </ButtonPrimary>
              <ButtonSecondary
                aria-label={`Cancelar edición tipo de envío ${shipping.name}`}
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    name: shipping.name,
                    price: shipping.price,
                    active: shipping.active,
                  });
                }}
                style={{ marginLeft: 8 }}
              >
                Cancelar
              </ButtonSecondary>
            </div>
          </form>
        ) : (
          <>
            <p>
              <b>Nombre:</b> {shipping.name}
            </p>
            <p>
              <b>Precio:</b> {shipping.price} €
            </p>
            <p>
              <b>Activo:</b> {shipping.active ? "Sí" : "No"}
            </p>
          </>
        )}
        {error && <p style={{ color: "#e53935" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ShippingDetailPanel;
