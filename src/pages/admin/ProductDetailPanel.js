import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ProductDetailPanel = ({ product, onClose, onEdit, onReloadProducts }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estado para edición de producto
  const [editForm, setEditForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    photo_url: product?.photo_url || "",
    handmade: product?.handmade ?? true,
    active: product?.active ?? true,
    featured: product?.featured ?? false,
    category_id: product?.category_id || "",
    availability: product?.availability || "stock",
  });

  // Cargar categorías para el select
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("id, name").order("name");
      if (!error) setCategories(data || []);
    };
    fetchCategories();
  }, []);

  // Personalizaciones y tipos
  const [personalizations, setPersonalizations] = useState([]);
  const [loadingPersonalizations, setLoadingPersonalizations] = useState(true);
  const [personalizationTypes, setPersonalizationTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // Para añadir/editar personalización
  const [showAddForm, setShowAddForm] = useState(false);
  const [persoForm, setPersoForm] = useState({
    name: "",
    personalization_type_id: "",
    required: false,
    additional_price: 0,
    description: "",
    active: true,
  });
  const [editingPersoId, setEditingPersoId] = useState(null);

  // Cargar tipos de personalización
  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      const { data, error } = await supabase
        .from("personalization_types")
        .select("*")
        .order("name", { ascending: true });
      if (!error) setPersonalizationTypes(data || []);
      setLoadingTypes(false);
    };
    fetchTypes();
  }, []);

  // Cargar personalizaciones del producto
  useEffect(() => {
    const fetchPersonalizations = async () => {
      setLoadingPersonalizations(true);
      const { data, error } = await supabase
        .from("personalizations")
        .select("*, personalization_type:personalization_types(*)")
        .eq("product_id", product.id);
      if (!error) setPersonalizations(data || []);
      setLoadingPersonalizations(false);
    };
    if (product?.id) fetchPersonalizations();
  }, [product?.id]);

  // Eliminar producto
  const handleDelete = async () => {
    if (
      !window.confirm(
        "¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer."
      )
    )
      return;
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

  // Guardar edición de producto
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    // Validaciones mínimas
    if (!editForm.name.trim()) {
      setError("El nombre es obligatorio.");
      setSaving(false);
      return;
    }
    if (!editForm.price || isNaN(editForm.price)) {
      setError("El precio debe ser un número.");
      setSaving(false);
      return;
    }
    if (!editForm.stock || isNaN(editForm.stock)) {
      setError("El stock debe ser un número.");
      setSaving(false);
      return;
    }
    // Actualizar producto
    const { error } = await supabase
      .from("products")
      .update({
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        photo_url: editForm.photo_url,
        handmade: editForm.handmade,
        active: editForm.active,
        featured: editForm.featured,
        category_id: editForm.category_id || null,
        availability: editForm.availability,
      })
      .eq("id", product.id);
    setSaving(false);
    if (error) {
      setError("Error al guardar los cambios: " + error.message);
    } else {
      setEditMode(false);
      if (onReloadProducts) onReloadProducts();
    }
  };

  // Añadir o editar personalización
  const handleSavePersonalization = async (e) => {
    e.preventDefault();
    setError("");
    if (!persoForm.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!persoForm.personalization_type_id) {
      setError("Selecciona un tipo.");
      return;
    }
    if (editingPersoId) {
      // Editar
      const { error } = await supabase
        .from("personalizations")
        .update({
          name: persoForm.name,
          personalization_type_id: persoForm.personalization_type_id,
          additional_price: Number(persoForm.additional_price) || 0,
          description: persoForm.description,
          active: persoForm.active,
        })
        .eq("id", editingPersoId);
      if (error) {
        setError("Error al editar la personalización.");
        return;
      }
    } else {
      // Añadir
      const { error } = await supabase.from("personalizations").insert([
        {
          product_id: product.id,
          name: persoForm.name,
          personalization_type_id: persoForm.personalization_type_id,
          additional_price: Number(persoForm.additional_price) || 0,
          description: persoForm.description,
          active: persoForm.active,
        },
      ]);
      if (error) {
        setError("Error al añadir la personalización.");
        return;
      }
    }
    setShowAddForm(false);
    setEditingPersoId(null);
    setPersoForm({
      name: "",
      personalization_type_id: "",
      required: false,
      additional_price: 0,
      description: "",
      active: true,
    });
    // Refrescar lista
    const { data } = await supabase
      .from("personalizations")
      .select("*, personalization_type:personalization_types(*)")
      .eq("product_id", product.id);
    setPersonalizations(data || []);
  };

  // Eliminar personalización
  const handleDeletePersonalization = async (id) => {
    const confirm = window.confirm(
      "¿Seguro que quieres eliminar esta personalización? Esta acción no se puede deshacer."
    );
    if (!confirm) return;
    const { error } = await supabase
      .from("personalizations")
      .delete()
      .eq("id", id);
    if (error) {
      setError("Error al eliminar la personalización.");
      return;
    }
    setPersonalizations((prev) => prev.filter((p) => p.id !== id));
  };

  // Editar personalización
  const handleEditPersonalization = (perso) => {
    setShowAddForm(true);
    setEditingPersoId(perso.id);
    setPersoForm({
      name: perso.name,
      personalization_type_id: perso.personalization_type_id,
      required: false,
      additional_price: perso.additional_price ?? 0,
      description: perso.description ?? "",
      active: perso.active ?? true,
    });
    setError("");
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
          margin-top: 12px;
        }
        .personalizations-table th, .personalizations-table td {
          border: 1px solid #d1c4e9;
          padding: 6px 10px;
          text-align: left;
        }
        .personalizations-table th {
          background: #ede7f6;
          color: #5e35b1;
        }
        .personalizations-table tr:nth-child(even) {
          background: #f8f6ff;
        }
        .perso-actions {
          display: flex;
          gap: 8px;
        }
        .perso-actions button {
          background: #ede7f6;
          color: #5e35b1;
          border: none;
          border-radius: 6px;
          padding: 4px 10px;
          cursor: pointer;
        }
        .perso-actions .delete-btn {
          background: #e53935;
          color: #fff;
        }
        .add-perso-form {
          margin-top: 16px;
          background: #fff;
          border: 1px solid #d1c4e9;
          border-radius: 8px;
          padding: 14px 10px;
        }
        .add-perso-form label {
          display: block;
          margin-bottom: 8px;
        }
        .add-perso-form input[type="text"], .add-perso-form select {
          width: 100%;
          padding: 6px;
          border-radius: 5px;
          border: 1px solid #d1c4e9;
        }
        .add-perso-form input[type="number"] {
          width: 100px;
          margin-left: 8px;
        }
        .add-perso-form textarea {
          width: 100%;
          border-radius: 5px;
          border: 1px solid #d1c4e9;
          padding: 6px;
        }
        .add-perso-form input[type="checkbox"] {
          margin-left: 8px;
        }
        .add-perso-form button {
          margin-top: 10px;
        }
        @keyframes fadeInDetail {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
      <div className="panel-actions">
        <button onClick={onClose}>Cerrar</button>
        {!editMode && (
          <button onClick={() => setEditMode(true)}>Editar producto</button>
        )}
        <button
          onClick={handleDelete}
          className="delete-btn"
          disabled={deleting}
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>

      {/* Modo edición de producto */}
      {editMode ? (
        <form onSubmit={handleSaveEdit} style={{ marginBottom: 24 }}>
          <h3>Editar producto #{product.id}</h3>
          <div style={{ display: "grid", gap: 14 }}>
            <label>
              Nombre:
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <label>
              Descripción:
              <textarea
                value={editForm.description || ""}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </label>
            <label>
              Precio:
              <input
                type="number"
                min="0"
                step="0.01"
                value={editForm.price}
                onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                required
              /> €
            </label>
            <label>
              Stock:
              <input
                type="number"
                min="0"
                step="1"
                value={editForm.stock}
                onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))}
                required
              />
            </label>
            <label>
              Foto (URL):
              <input
                type="text"
                value={editForm.photo_url}
                onChange={e => setEditForm(f => ({ ...f, photo_url: e.target.value }))}
              />
            </label>
            <label>
              Categoría:
              <select
                value={editForm.category_id || ""}
                onChange={e => setEditForm(f => ({ ...f, category_id: e.target.value }))}
              >
                <option value="">Sin categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>
            <div style={{ display: "flex", gap: 18 }}>
              <label>
                <input
                  type="checkbox"
                  checked={!!editForm.handmade}
                  onChange={e => setEditForm(f => ({ ...f, handmade: e.target.checked }))}
                />
                Hecho a mano
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!!editForm.active}
                  onChange={e => setEditForm(f => ({ ...f, active: e.target.checked }))}
                />
                Activo
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!!editForm.featured}
                  onChange={e => setEditForm(f => ({ ...f, featured: e.target.checked }))}
                />
                Destacado
              </label>
            </div>
            <label>
              Disponibilidad:
              <select
                value={editForm.availability}
                onChange={e => setEditForm(f => ({ ...f, availability: e.target.value }))}
              >
                <option value="stock">Stock</option>
                <option value="preorder">Preventa</option>
                <option value="unavailable">No disponible</option>
              </select>
            </label>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setEditForm({
                  name: product?.name || "",
                  description: product?.description || "",
                  price: product?.price || 0,
                  stock: product?.stock || 0,
                  photo_url: product?.photo_url || "",
                  handmade: product?.handmade ?? true,
                  active: product?.active ?? true,
                  featured: product?.featured ?? false,
                  category_id: product?.category_id || "",
                  availability: product?.availability || "stock",
                });
                setError("");
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3>Detalle producto #{product.id}</h3>
          <p><b>Nombre:</b> {product.name}</p>
          <p><b>Descripción:</b> {product.description || "-"}</p>
          <p><b>Precio:</b> {Number(product.price).toFixed(2)} €</p>
          <p><b>Stock:</b> {product.stock}</p>
          <p><b>Ventas:</b> {product.sales_count ?? 0}</p>
          <p><b>Activo:</b> {product.active ? "Sí" : "No"}</p>
          <p><b>Hecho a mano:</b> {product.handmade ? "Sí" : "No"}</p>
          <p><b>Destacado:</b> {product.featured ? "Sí" : "No"}</p>
          <p><b>Categoría:</b> {categories.find(c => c.id === product.category_id)?.name || "-"}</p>
          <p><b>Disponibilidad:</b> {product.availability || "-"}</p>
          <p><b>Foto:</b> {product.photo_url ? <a href={product.photo_url} target="_blank" rel="noopener noreferrer">Ver imagen</a> : "-"}</p>
        </>
      )}

      {/* Personalizaciones */}
      <div style={{ marginTop: 24 }}>
        <b>Personalizaciones:</b>
        {loadingPersonalizations ? (
          <div style={{ color: "#888", marginTop: 8 }}>Cargando...</div>
        ) : personalizations.length === 0 ? (
          <div style={{ color: "#888", marginTop: 8 }}>
            Este producto no tiene personalizaciones.
          </div>
        ) : (
          <table className="personalizations-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Precio extra</th>
                <th>Descripción</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personalizations.map((perso) => (
                <tr key={perso.id}>
                  <td>{perso.name}</td>
                  <td>
                    {perso.personalization_type
                      ? perso.personalization_type.name
                      : "-"}
                  </td>
                  <td>
                    {perso.additional_price
                      ? Number(perso.additional_price).toFixed(2) + " €"
                      : "0.00 €"}
                  </td>
                  <td>{perso.description || "-"}</td>
                  <td>{perso.active ? "Sí" : "No"}</td>
                  <td>
                    <div className="perso-actions">
                      <button onClick={() => handleEditPersonalization(perso)}>
                        Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeletePersonalization(perso.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Formulario añadir/editar */}
        <div style={{ marginTop: 12, width: "100%" }}>
          <button
            onClick={() => {
              setShowAddForm((v) => !v);
              setEditingPersoId(null);
              setPersoForm({
                name: "",
                personalization_type_id: "",
                required: false,
                additional_price: 0,
                description: "",
                active: true,
              });
              setError("");
            }}
            className="save-btn"
            style={{
              width: "100%",
              padding: "10px 0",
              fontSize: 16,
              marginTop: 0,
              marginBottom: 0,
              borderRadius: 6,
            }}
          >
            {showAddForm ? "Cancelar" : "Añadir personalización"}
          </button>
        </div>
        {showAddForm && (
          <form className="add-perso-form" onSubmit={handleSavePersonalization}>
            <label>
              Nombre:
              <input
                type="text"
                value={persoForm.name}
                onChange={(e) =>
                  setPersoForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Tipo:
              <select
                value={persoForm.personalization_type_id}
                onChange={(e) =>
                  setPersoForm((f) => ({
                    ...f,
                    personalization_type_id: e.target.value,
                  }))
                }
                required
              >
                <option value="">Selecciona tipo</option>
                {personalizationTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Precio extra:
              <input
                type="number"
                min="0"
                step="0.01"
                value={persoForm.additional_price}
                onChange={(e) =>
                  setPersoForm((f) => ({
                    ...f,
                    additional_price: e.target.value,
                  }))
                }
              />{" "}
              €
            </label>
            <label>
              Descripción:
              <textarea
                value={persoForm.description}
                onChange={(e) =>
                  setPersoForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                rows={2}
              />
            </label>
            <label>
              Activo:
              <input
                type="checkbox"
                checked={!!persoForm.active}
                onChange={(e) =>
                  setPersoForm((f) => ({
                    ...f,
                    active: e.target.checked,
                  }))
                }
              />
            </label>
            <button
              type="submit"
              className="save-btn"
              style={{ width: "100%" }}
            >
              {editingPersoId ? "Guardar cambios" : "Añadir"}
            </button>
          </form>
        )}
      </div>
      {error && <p style={{ color: "#e53935" }}>{error}</p>}
    </div>
  );
};

export default ProductDetailPanel;
