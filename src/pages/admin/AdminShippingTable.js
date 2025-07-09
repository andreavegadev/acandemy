import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Table from "../../components/Table";

const AdminShippingTable = () => {
  const [shippingTypes, setShippingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShipping = async () => {
      setLoading(true);
      let query = supabase
        .from("shipping")
        .select("*")
        .order("created_at", { ascending: false });

      const { data } = await query;
      setShippingTypes(data || []);
      setLoading(false);
    };
    fetchShipping();
  }, []);

  const onAddShipping = () => {
    navigate("/admin/shippings/add");
  };

  const onShippingSelect = (shipping) => {
    if (shipping && shipping.id) {
      navigate(`/admin/shippings/${shipping.id}`);
    }
  };

  return (
    <div>
      <Table
        title="Tipos de Envío"
        items={shippingTypes.map((shipping) => ({
          id: shipping.id,
          nombre: shipping.name,
          precio: shipping.price + "€",
          activo: shipping.active ? "Sí" : "No",
        }))}
        onClick={onShippingSelect}
        filters={[
          { key: "nombre", label: "Buscar nombre" },
          {
            key: "activo",
            label: "Filtrar por activo",
            type: "select",
            options: [
              { value: "Sí", label: "Sí" },
              { value: "No", label: "No" },
            ],
          },
        ]}
        addItems
        onClickAdd={onAddShipping}
      />
      {loading && <p>Cargando...</p>}
      {!loading && shippingTypes.length === 0 && <p>Sin tipos de envío</p>}
    </div>
  );
};

export default AdminShippingTable;
