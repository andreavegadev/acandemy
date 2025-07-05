import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
} from "../../components/Button";

const PersonalizationTypeDetailPanel = ({ type, onClose, onReloadTypes }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: type?.name || "",
    description: type?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("personalization_types")
      .update({
        name: form.name,
        description: form.description,
      })
      .eq("id", type.id);
    setSaving(false);
    if (error) {
      setError("Error al actualizar: " + error.message);
    } else {
      setEditMode(false);
      if (onReloadTypes) onReloadTypes();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este tipo?")) return;
    setDeleting(true);
    setError("");
    const { error } = await supabase
      .from("personalization_types")
      .delete()
      .eq("id", type.id);
    setDeleting(false);
    if (error) {
      setError("Error al eliminar: " + error.message);
    } else {
      if (onReloadTypes) onReloadTypes();
      if (onClose) onClose();
    }
  };

  if (!type) return null;
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
        .detail-panel label {
          display: block;
          margin: 8px 0 4px 0;
          font-weight: 500;
        }
        .detail-panel input[type="text"] {
          width: 100%;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #d1c4e9;
          font-size: 15px;
          margin-bottom: 8px;
        }
        .detail-panel textarea {
          width: 100%;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #d1c4e9;
          font-size: 15px;
          margin-bottom: 8px;
          min-height: 60px;
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
            aria-label={`Cerrar tipo de personalizacion ${type.name}`}
          >
            Cerrar
          </ButtonSecondary>
          {!editMode && (
            <ButtonSecondary
              onClick={() => setEditMode(true)}
              aria-label={`Editar personalizacion ${type.name}`}
            >
              Editar
            </ButtonSecondary>
          )}
          <ButtonDanger onClick={handleDelete} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </ButtonDanger>
        </div>
        <h3>Detalle tipo de personalización #{type.id}</h3>
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
            <label>Descripción:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            <div style={{ marginTop: 12 }}>
              <ButtonPrimary
                type="submit"
                disabled={saving}
                aria-label={`Guardar personalización ${type.name}`}
              >
                {saving ? "Guardando..." : "Guardar"}
              </ButtonPrimary>
              <ButtonSecondary
                aria-label={`Cancelar edición personalización ${type.name}`}
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    name: type.name,
                    description: type.description,
                  });
                }}
              >
                Cancelar
              </ButtonSecondary>
            </div>
          </form>
        ) : (
          <>
            <p>
              <b>Nombre:</b> {type.name}
            </p>
            <p>
              <b>Descripción:</b> {type.description}
            </p>
          </>
        )}
        {error && <p style={{ color: "#e53935" }}>{error}</p>}
      </div>
    </div>
  );
};

export default PersonalizationTypeDetailPanel;
