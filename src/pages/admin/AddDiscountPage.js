import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Input from "../../components/Input";
import { ButtonPrimary } from "../../components/Button";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { Stack } from "../../components/LayoutUtilities";
import TextArea from "../../components/TextArea";
import { Checkbox } from "../../components/Checkbox";

const AddDiscountPage = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const defaultStartDate = `${now.getFullYear()}-${pad(
    now.getMonth() + 1
  )}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "Percentage",
    percentage: "",
    amount: "",
    user_id: "",
    max_uses: "",
    start_date: defaultStartDate,
    end_date: "",
    min_order: "",
    active: true,
  });

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

    if (!form.code) return setError("El código es obligatorio.");
    if (!form.type) return setError("El tipo de descuento es obligatorio.");

    if (form.type === "Percentage") {
      if (!form.percentage || Number(form.percentage) <= 0)
        return setError("El porcentaje debe ser mayor que 0.");
      if (Number(form.percentage) > 100)
        return setError("El porcentaje no puede ser mayor que 100.");
    }

    if (form.type === "Amount") {
      if (!form.amount || Number(form.amount) <= 0)
        return setError("El importe debe ser mayor que 0.");
    }

    if (form.min_order && Number(form.min_order) <= 0)
      return setError("El pedido mínimo debe ser mayor que 0.");

    if (
      form.min_order &&
      form.type === "Amount" &&
      Number(form.min_order) < Number(form.amount)
    )
      return setError("El descuento debe ser menor que el pedido mínimo.");

    if (!form.start_date) return setError("La fecha de inicio es obligatoria.");

    const discountData = {
      code: form.code,
      description: form.description || null,
      type: form.type,
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
      setTimeout(() => navigate("/admin/discounts"), 1200);
    }
  };

  return (
    <Stack gap={24}>
      <Breadcrumbs
        items={[
          {
            label: "Descuentos",
            onClick: () => navigate("/admin/discounts"),
          },
          { label: `Descuento`, current: true },
        ]}
      />
      <Heading as="h2">Crear Código Descuento</Heading>
      <form
        onSubmit={handleSubmit}
        className="discount-form"
        autoComplete="off"
      >
        <Stack gap={16}>
          <Input
            type="text"
            name="code"
            label="Código de descuento"
            value={form.code}
            onChange={handleChange}
            required
          />
          <TextArea
            name="description"
            label="Breve descripción"
            value={form.description}
            onChange={handleChange}
            rows={2}
            maxLength={120}
          />
          <div className="discount-radio-group">
            <span>Tipo de descuento:</span>
            <label>
              <Input
                type="radio"
                name="type"
                value="Percentage"
                checked={form.type === "Percentage"}
                onChange={handleChange}
              />
              Porcentaje
            </label>
            <label>
              <Input
                type="radio"
                name="type"
                value="Amount"
                checked={form.type === "Amount"}
                onChange={handleChange}
              />
              Importe fijo
            </label>
          </div>
          {form.type === "Percentage" ? (
            <Input
              label="Porcentaje (%)"
              type="number"
              name="percentage"
              value={form.percentage}
              onChange={handleChange}
              min={1}
              max={100}
              required
            />
          ) : (
            <Input
              label="Importe (€)"
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min={1}
              required
            />
          )}
          <Input
            label="Pedido mínimo (€)"
            type="number"
            name="min_order"
            value={form.min_order}
            onChange={handleChange}
            min={0.01}
            step="0.01"
          />
          <Input
            label="Máximo de usos"
            type="number"
            name="max_uses"
            value={form.max_uses}
            onChange={handleChange}
            min={1}
          />
          <Input
            label="Buscar usuario (nombre o email)"
            type="text"
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setForm((prev) => ({ ...prev, user_id: "" }));
            }}
          />
          {users.length > 0 && (
            <ul className="discount-user-list">
              {users.map((user) => (
                <li key={user.id} onMouseDown={() => handleUserSelect(user)}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}
          {form.user_id && (
            <div className="discount-user-selected">Usuario asignado</div>
          )}
          <Input
            label="Fecha de inicio"
            type="datetime-local"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
          <Input
            label="Fecha de finalización"
            type="datetime-local"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
          />
          <Checkbox
            label="Activo"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          {console.log(form)}
          <div className="discount-form-actions">
            <ButtonPrimary type="submit" aria-label="Crear código descuento">
              Crear código
            </ButtonPrimary>
          </div>
          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}
        </Stack>
      </form>
    </Stack>
  );
};

export default AddDiscountPage;
