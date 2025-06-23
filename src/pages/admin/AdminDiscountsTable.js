import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const AdminDiscountsTable = ({ onDiscountSelect, onAddDiscount }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterValidity, setFilterValidity] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      let query = supabase
        .from("discounts")
        .select("*")
        .order("created_at", { ascending: false });

      // Filtro estado
      if (filterActive === "active") query = query.eq("active", true);
      if (filterActive === "inactive") query = query.eq("active", false);

      // Filtro tipo
      if (filterType === "Percentage") query = query.eq("type", "Percentage");
      if (filterType === "Amount") query = query.eq("type", "Amount");

      // Filtro usuario
      if (filterUser === "assigned") query = query.not("user_id", "is", null);
      if (filterUser === "general") query = query.is("user_id", null);

      // Filtro búsqueda
      if (search.length > 1) {
        query = query.or(
          `code.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      // Filtro vigencia (en JS tras traer los datos)
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      let { data } = await query.range(from, to);

      // Filtro de vigencia en frontend
      if (filterValidity !== "all" && data) {
        const now = new Date();
        data = data.filter((d) => {
          const start = d.start_date ? new Date(d.start_date) : null;
          const end = d.end_date ? new Date(d.end_date) : null;
          if (filterValidity === "vigente") {
            return (
              (!start || start <= now) &&
              (!end || end >= now)
            );
          }
          if (filterValidity === "caducado") {
            return end && end < now;
          }
          if (filterValidity === "futuro") {
            return start && start > now;
          }
          return true;
        });
      }

      setDiscounts(data || []);
      setLoading(false);
    };
    fetchDiscounts();
  }, [filterActive, filterType, filterValidity, filterUser, search, page, pageSize]);

  const totalPages = Math.ceil(discounts.length / pageSize);

  const handleEdit = (discount) => {
    setEditingId(discount.id);
    setEditForm({ ...discount });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    // Solo actualiza los campos editables
    const updateData = {
      code: editForm.code,
      type: editForm.type,
      percentage: editForm.type === "Percentage" ? Number(editForm.percentage) : null,
      amount: editForm.type === "Amount" ? Number(editForm.amount) : null,
      min_order: editForm.min_order ? Number(editForm.min_order) : null,
      max_uses: editForm.max_uses ? Number(editForm.max_uses) : null,
      start_date: editForm.start_date || null,
      end_date: editForm.end_date || null,
      active: editForm.active,
    };
    await supabase.from("discounts").update(updateData).eq("id", editingId);
    setEditingId(null);
    // Refresca la tabla
    // Puedes volver a llamar a fetchDiscounts() si lo tienes accesible, o recargar la página
    window.location.reload();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleClearFilters = () => {
    setFilterActive("all");
    setFilterType("all");
    setFilterValidity("all");
    setFilterUser("all");
    setSearch("");
    setPage(1);
    setPageSize(10); // o el valor por defecto que prefieras
  };

  const handleDoubleClick = (discount) => {
    if (onDiscountSelect) onDiscountSelect(discount);
  };

  if (loading) return <div>Cargando códigos descuento...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2>Códigos Descuento</h2>
        <button onClick={onAddDiscount}>Crear código descuento</button>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
        <label>
          Estado:&nbsp;
          <select value={filterActive} onChange={e => { setFilterActive(e.target.value); setPage(1); }}>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </label>
        <label>
          Tipo:&nbsp;
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
            <option value="all">Todos</option>
            <option value="Percentage">Porcentaje</option>
            <option value="Amount">Importe fijo</option>
          </select>
        </label>
        <label>
          Vigencia:&nbsp;
          <select value={filterValidity} onChange={e => { setFilterValidity(e.target.value); setPage(1); }}>
            <option value="all">Todas</option>
            <option value="vigente">Vigentes</option>
            <option value="caducado">Caducados</option>
            <option value="futuro">Futuros</option>
          </select>
        </label>
        <label>
          Usuario:&nbsp;
          <select value={filterUser} onChange={e => { setFilterUser(e.target.value); setPage(1); }}>
            <option value="all">Todos</option>
            <option value="assigned">Solo asignados</option>
            <option value="general">Solo generales</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Buscar código o descripción"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ minWidth: 180 }}
        />
        <label>
          Ver&nbsp;
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {[5, 10, 20, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          &nbsp;por página
        </label>
        <button onClick={handleClearFilters}>Limpiar filtros</button>
      </div>
      <table className="admin-products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Pedido mínimo</th>
            <th>Máx. usos</th>
            <th>Válido desde</th>
            <th>Válido hasta</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) =>
            editingId === discount.id ? (
              <tr key={discount.id}>
                <td>
                  <input
                    type="text"
                    name="code"
                    value={editForm.code}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleChange}
                  >
                    <option value="Percentage">Porcentaje</option>
                    <option value="Amount">Importe fijo</option>
                  </select>
                </td>
                <td>
                  {editForm.type === "percentage" ? (
                    <input
                      type="number"
                      name="percentage"
                      value={editForm.percentage || ""}
                      onChange={handleChange}
                      min={1}
                      max={100}
                    />
                  ) : (
                    <input
                      type="number"
                      name="amount"
                      value={editForm.amount || ""}
                      onChange={handleChange}
                      min={0.01}
                      step="0.01"
                    />
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="min_order"
                    value={editForm.min_order || ""}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="max_uses"
                    value={editForm.max_uses || ""}
                    onChange={handleChange}
                    min={1}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    name="valid_from"
                    value={editForm.valid_from || ""}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    name="valid_until"
                    value={editForm.valid_until || ""}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="active"
                    checked={editForm.active}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <button onClick={handleSave}>Guardar</button>
                  <button onClick={handleCancel}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={discount.id} onDoubleClick={() => handleDoubleClick(discount)}>
                <td>{discount.code}</td>
                <td>
                  {discount.type === "Percentage"
                    ? "Porcentaje"
                    : "Importe fijo"}
                </td>
                <td>
                  {discount.type === "Percentage"
                    ? `${discount.percentage}%`
                    : `${discount.amount}€`}
                </td>
                <td>{discount.min_order ? `${discount.min_order}€` : "-"}</td>
                <td>{discount.max_uses || "-"}</td>
                <td>{discount.valid_from || "-"}</td>
                <td>{discount.valid_until || "-"}</td>
                <td>
                  <input type="checkbox" checked={discount.active} readOnly />
                </td>
                <td>
                  <button onClick={() => handleEdit(discount)}>Editar</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div
        style={{
          marginTop: "1em",
          display: "flex",
          alignItems: "center",
          gap: "1em",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
        <span>
          Ir a página:&nbsp;
          <input
            type="number"
            min={1}
            max={totalPages}
            value={page}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val > totalPages) val = totalPages;
              if (val < 1) val = 1;
              setPage(val);
            }}
            style={{ width: 60 }}
          />
        </span>
      </div>
    </div>
  );
};

export default AdminDiscountsTable;
