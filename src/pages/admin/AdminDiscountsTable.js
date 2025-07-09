import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Table from "../../components/Table";

const AdminDiscountsTable = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      let query = supabase
        .from("discounts")
        .select("*")
        .order("created_at", { ascending: false });

      let { data } = await query;

      setDiscounts(data || []);
      setLoading(false);
    };
    fetchDiscounts();
  }, []);

  const onAddDiscount = () => {
    navigate("/admin/discounts/add");
  };

  const onDiscountSelect = (discount) => {
    if (discount && discount.id) {
      navigate(`/admin/discounts/${discount.id}`);
    }
  };

  return (
    <div>
      <Table
        title="Descuentos"
        items={discounts.map((discount) => ({
          id: discount.id,
          código: discount.code,
          tipo: discount.type === "Percentage" ? "Porcentaje" : "Importe fijo",
          valor:
            discount.type === "Percentage"
              ? `${discount.percentage}%`
              : `${discount.amount}€`,
          "pedido mínimo": discount.min_order ? `${discount.min_order}€` : "-",
          "máx. usos": discount.max_uses || "-",
          "válido desde": discount.start_date || "-",
          "válido hasta": discount.end_date || "-",
          activo: discount.active ? "Sí" : "No",
        }))}
        onClick={onDiscountSelect}
        addItems
        onClickAdd={onAddDiscount}
      />
      {loading && <p>Cargando...</p>}
      {!loading && discounts.length === 0 && <p>Sin descuentos</p>}
    </div>
  );
};

export default AdminDiscountsTable;
