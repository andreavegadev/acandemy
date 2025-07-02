import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ProductDetailPanel = ({
  product,
  onClose,
  onEdit,
  onReloadProducts,
  onAddPersonalization,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [personalizations, setPersonalizations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [types, setTypes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPers, setNewPers] = useState({
    name: "",
    description: "",
    additional_price: 0,
    personalization_type_id: "",
    active: true,
  });

  // Cargar personalizaciones y tipos
  useEffect(() => {
    if (!product) return;
    const fetchData = async () => {
      const { data: pers } = await supabase
        .from("personalizations")
        .select("*, personalization_types(name)")
        .eq("product_id", product.id)
        .order("id", { ascending: true });
      setPersonalizations(pers || []);
      const { data: tps } = await supabase
        .from("personalization_types")
        .select("*");
      setTypes(tps || []);
    };
    fetchData();
  }, [product]);

  const handleDeletePersonalization = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta personalización?"))
      return;
    await supabase.from("personalizations").delete().eq("id", id);
    setPersonalizations((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditPersonalization = (pers) => {
    setEditingId(pers.id);
    setEditForm({
      name: pers.name,
      description: pers.description || "",
      additional_price: pers.additional_price,
      personalization_type_id: pers.personalization_type_id || "",
      active: pers.active,
    });
  };

  const handleSavePersonalization = async (id) => {
    if (!editForm.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (
      isNaN(editForm.additional_price) ||
      Number(editForm.additional_price) < 0
    ) {
      setError("El precio adicional debe ser mayor o igual a 0.");
      return;
    }
    setError("");
    await supabase
      .from("personalizations")
      .update({
        name: editForm.name,
        description: editForm.description,
        additional_price: Number(editForm.additional_price),
        personalization_type_id: editForm.personalization_type_id || null,
        active: editForm.active,
      })
      .eq("id", id);
    setEditingId(null);
    // Refresca la lista
    const { data: pers } = await supabase
      .from("personalizations")
      .select("*, personalization_types(name)")
      .eq("product_id", product.id)
      .order("id", { ascending: true });
    setPersonalizations(pers || []);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError("");
  };

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

  const handleAddPersonalization = async () => {
    if (!newPers.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (
      isNaN(newPers.additional_price) ||
      Number(newPers.additional_price) < 0
    ) {
      setError("El precio adicional debe ser mayor o igual a 0.");
      return;
    }
    setError("");
    const { error: insertError } = await supabase
      .from("personalizations")
      .insert([
        {
          name: newPers.name,
          description: newPers.description,
          additional_price: Number(newPers.additional_price),
          personalization_type_id: newPers.personalization_type_id || null,
          active: newPers.active,
          product_id: product.id,
        },
      ]);
    if (insertError) {
      setError("Error al crear la personalización: " + insertError.message);
      return;
    }
    setShowAddForm(false);
    setNewPers({
      name: "",
      description: "",
      additional_price: 0,
      personalization_type_id: "",
      active: true,
    });
    // Refresca la lista
    const { data: pers } = await supabase
      .from("personalizations")
      .select("*, personalization_types(name)")
      .eq("product_id", product.id)
      .order("id", { ascending: true });
    setPersonalizations(pers || []);
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
          max-width: 520px;
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
        .panel-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .personalizations-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 18px;
          margin-bottom: 10px;
        }
        .personalizations-table th, .personalizations-table td {
          border: 1px solid #d1c4e9;
          padding: 6px 8px;
          text-align: left;
        }
        .personalizations-table th {
          background: #ede7f6;
          color: #5e35b1;
        }
        .personalizations-table td {
          background: #fff;
        }
        .personalizations-table input, .personalizations-table select {
          font-size: 15px;
          padding: 3px 6px;
          border-radius: 5px;
          border: 1px solid #d1c4e9;
        }
        .personalizations-table textarea {
          font-size: 15px;
          padding: 3px 6px;
          border-radius: 5px;
          border: 1px solid #d1c4e9;
          min-width: 120px;
        }
        .personalizations-table .actions {
          display: flex;
          gap: 6px;
        }
        .personalizations-table .delete-btn {
          background: #e53935;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 3px 10px;
          cursor: pointer;
        }
        .personalizations-table .delete-btn:hover {
          background: #b71c1c;
        }
        .personalizations-table .save-btn {
          background: #5e35b1;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 3px 10px;
          cursor: pointer;
        }
        .personalizations-table .cancel-btn {
          background: #ede7f6;
          color: #5e35b1;
          border: none;
          border-radius: 5px;
          padding: 3px 10px;
          cursor: pointer;
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <div className="panel-actions">
        <button onClick={onClose}>Cerrar</button>
        <button onClick={() => onEdit(product)}>Editar</button>
        <button
          onClick={() => {
            setShowAddForm((v) => !v);
            setEditingId(null);
            setEditForm({});
            setError("");
          }}
          className="save-btn"
        >
          {showAddForm ? "Cancelar" : "Añadir personalización"}
        </button>
        <button
          onClick={handleDelete}
          className="delete-btn"
          disabled={deleting}
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
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

      {/* Personalizaciones */}
      <h4 style={{ marginTop: 24, color: "#7e57c2" }}>Personalizaciones</h4>
      {personalizations.length === 0 ? (
        <p style={{ color: "#888" }}>
          Este producto no tiene personalizaciones.
        </p>
      ) : (
        <table className="personalizations-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Precio adicional</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personalizations.map((pers) =>
              editingId === pers.id ? (
                <tr key={pers.id}>
                  <td>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={editForm.personalization_type_id || ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          personalization_type_id: e.target.value,
                        }))
                      }
                    >
                      <option value="">Sin tipo</option>
                      {types.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.additional_price}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          additional_price: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={editForm.active}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, active: e.target.checked }))
                      }
                    />
                  </td>
                  <td className="actions">
                    <button
                      className="save-btn"
                      onClick={() => handleSavePersonalization(pers.id)}
                    >
                      Guardar
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      Cancelar
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={pers.id}>
                  <td>{pers.name}</td>
                  <td>{pers.personalization_types?.name || "-"}</td>
                  <td>{pers.description}</td>
                  <td>{Number(pers.additional_price).toFixed(2)} €</td>
                  <td>
                    <input type="checkbox" checked={pers.active} readOnly />
                  </td>
                  <td className="actions">
                    <button
                      className="save-btn"
                      onClick={() => handleEditPersonalization(pers)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeletePersonalization(pers.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
      {error && <p style={{ color: "#e53935" }}>{error}</p>}

      {/* Nuevo formulario de personalización */}
      {showAddForm && editingId === null && (
        <div
          className="add-personalization-form"
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{ margin: 0, color: "#7e57c2", fontSize: "1.2em" }}>
            Añadir personalización
          </h4>
          <div style={{ marginTop: 12 }}>
            <label>Nombre</label>
            <input
              type="text"
              value={newPers.name}
              onChange={(e) => setNewPers({ ...newPers, name: e.target.value })}
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Descripción</label>
            <textarea
              value={newPers.description}
              onChange={(e) =>
                setNewPers({ ...newPers, description: e.target.value })
              }
              style={{ width: "100%", marginTop: 4, minHeight: 60 }}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Precio adicional (€)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newPers.additional_price}
              onChange={(e) =>
                setNewPers({ ...newPers, additional_price: e.target.value })
              }
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Tipo de personalización</label>
            <select
              value={newPers.personalization_type_id}
              onChange={(e) =>
                setNewPers({
                  ...newPers,
                  personalization_type_id: e.target.value,
                })
              }
              style={{ width: "100%", marginTop: 4 }}
            >
              <option value="">Sin tipo</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              onClick={handleAddPersonalization}
              className="save-btn"
              style={{ flex: 1 }}
            >
              Guardar personalización
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="cancel-btn"
              style={{ flex: 1 }}
            >
              Cancelar
            </button>
          </div>
          {error && <p style={{ color: "#e53935", marginTop: 12 }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPanel;
