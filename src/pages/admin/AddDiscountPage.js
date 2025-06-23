import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "../../styles/AddDiscountPage.css";

const AddDiscountPage = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const defaultStartDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "Percentage", // o el valor por defecto de tu enum discount_type
    percentage: "",
    amount: "",
    user_id: "",
    max_uses: "",
    start_date: defaultStartDate, // <-- por defecto ahora
    end_date: "",
    min_order: "",
    active: true,
  });
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Buscar usuarios por nombre o email
  useEffect(() => {
    if (userSearch.length < 2) {
      setUsers([]);
      return;
    }
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, name, email")
        .or(`name.ilike.%${userSearch}%,email.ilike.%${userSearch}%`)
        .limit(10);
      setUsers(data || []);
    };
    fetchUsers();
  }, [userSearch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserSelect = (user) => {
    setForm((prev) => ({ ...prev, user_id: user.id }));
    setUserSearch(`${user.name} (${user.email})`);
    setUsers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    // Validaciones mínimas según constraints
    if (!form.code) {
      setError("El código es obligatorio.");
      return;
    }
    if (!form.type) {
      setError("El tipo de descuento es obligatorio.");
      return;
    }
    if (
      form.type === "Percentage" &&
      (!form.percentage || Number(form.percentage) <= 0)
    ) {
      setError("El porcentaje debe ser mayor que 0.");
      return;
    }
    if (
      form.type === "Percentage" &&
      (!form.percentage || Number(form.percentage) > 100)
    ) {
      setError("El porcentaje no puede ser mayor que 100.");
      return;
    }
    if (form.type === "Amount" && (!form.amount || Number(form.amount) <= 0)) {
      setError("El importe debe ser mayor que 0.");
      return;
    }
    if (form.min_order && Number(form.min_order) <= 0) {
      setError("El pedido mínimo debe ser mayor que 0.");
      return;
    }
    if (
      form.min_order &&
      form.type === "Amount" &&
      Number(form.min_order) < Number(form.amount)
    ) {
      setError("El descuento debe que ser mayor que el pedido mínimo.");
      return;
    }
    if (!form.start_date) {
      setError("La fecha de inicio es obligatoria.");
      return;
    }

    const discountData = {
      code: form.code,
      description: form.description || null,
      type: form.type, // Esto enviará "Percentage" o "Amount"
      percentage: form.type === "Percentage" ? Number(form.percentage) : null,
      amount: form.type === "Amount" ? Number(form.amount) : null,
      user_id: form.user_id || null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      min_order: form.min_order ? Number(form.min_order) : null,
      active: form.active,
    };

    const { error } = await supabase.from("discounts").insert([discountData]);
    if (error) {
      setError("Error al crear el descuento: " + error.message);
    } else {
      setSuccess("¡Descuento creado correctamente!");
      setForm({
        code: "",
        description: "",
        type: "Percentage",
        percentage: "",
        amount: "",
        user_id: "",
        max_uses: "",
        start_date: "",
        end_date: "",
        min_order: "",
        active: true,
      });
      setUserSearch("");
    }
  };

  return (
    <div className="discount-form-container">
      <h2>Crear Código Descuento</h2>
      <form
        onSubmit={handleSubmit}
        className="discount-form"
        autoComplete="off"
      >
        <div className="discount-form-row">
          <label>
            Código:
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="discount-form-row">
          <label>
            Descripción:
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              maxLength={120}
              placeholder="Breve descripción del descuento"
              style={{ resize: "vertical", minHeight: 40 }}
            />
          </label>
        </div>
        <div className="discount-form-row">
          <label>
            Tipo de descuento:
            <div className="discount-radio-group">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="Percentage"
                  checked={form.type === "Percentage"}
                  onChange={handleChange}
                  required
                />
                Porcentaje
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="Amount"
                  checked={form.type === "Amount"}
                  onChange={handleChange}
                  required
                />
                Importe fijo
              </label>
            </div>
          </label>
        </div>
        <div className="discount-form-row">
          {form.type === "Percentage" ? (
            <label>
              Porcentaje (%):
              <input
                type="number"
                name="percentage"
                value={form.percentage}
                onChange={handleChange}
                min={1}
                max={100}
                required
              />
            </label>
          ) : (
            <label>
              Importe fijo (€):
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min={1}
                required
              />
            </label>
          )}
        </div>
        <div className="discount-form-row">
          <label>
            Pedido mínimo (€):
            <input
              type="number"
              name="min_order"
              value={form.min_order}
              onChange={handleChange}
              min={0.01}
              step="0.01"
              placeholder="Opcional"
            />
          </label>
          <label>
            Número máximo de usos:
            <input
              type="number"
              name="max_uses"
              value={form.max_uses}
              onChange={handleChange}
              min={1}
              placeholder="Opcional"
            />
          </label>
        </div>
        <div className="discount-form-row">
          <div style={{ position: "relative", flex: 1 }}>
            <label>
              Usuario (opcional):
              <input
                type="text"
                placeholder="Buscar por nombre o email"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setForm((prev) => ({ ...prev, user_id: "" }));
                }}
                autoComplete="off"
              />
              {users.length > 0 && (
                <ul className="discount-user-list">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      onMouseDown={() => handleUserSelect(user)}
                    >
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
              {form.user_id && (
                <div className="discount-user-selected">
                  Usuario seleccionado
                </div>
              )}
            </label>
          </div>
        </div>
        <div className="discount-form-row">
          <label>
            Fecha de inicio:
            <input
              type="datetime-local"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Fecha de fin:
            <input
              type="datetime-local"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              placeholder="Opcional"
            />
          </label>
          <label className="discount-checkbox">
            Activo:
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="discount-form-actions">
          <button type="submit">Crear código</button>
        </div>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AddDiscountPage;
