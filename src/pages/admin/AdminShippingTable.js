import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonSecondary } from "../../components/Button";

const AdminShippingTable = ({ onAddShipping, onShippingSelect }) => {
  const [shippingTypes, setShippingTypes] = useState([]);
  const [filterActive, setFilterActive] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchShipping = async () => {
      let query = supabase
        .from("shipping")
        .select("*")
        .order("created_at", { ascending: false });

      // Filtro estado
      if (filterActive === "active") query = query.eq("active", true);
      if (filterActive === "inactive") query = query.eq("active", false);

      // Filtro búsqueda
      if (search.length > 1) {
        query = query.ilike("name", `%${search}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      let { data } = await query.range(from, to);

      setShippingTypes(data || []);
    };
    fetchShipping();
  }, [filterActive, search, page, pageSize]);

  const totalPages = Math.ceil(shippingTypes.length / pageSize);

  const handleClearFilters = () => {
    setFilterActive("all");
    setSearch("");
    setPage(1);
    setPageSize(10);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2>Tipos de Envío</h2>
        <ButtonSecondary
          onClick={onAddShipping}
          aria-label={`Crear tipo de envío`}
        >
          Crear tipo de envío
        </ButtonSecondary>
      </div>
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}
      >
        <label>
          Estado:&nbsp;
          <select
            value={filterActive}
            onChange={(e) => {
              setFilterActive(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Buscar nombre"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ minWidth: 180 }}
        />
        <label>
          Ver&nbsp;
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          &nbsp;por página
        </label>
        <ButtonSecondary
          onClick={handleClearFilters}
          aria-label={`Limpiar filtros`}
        >
          Limpiar filtros
        </ButtonSecondary>
      </div>
      <table className="admin-products-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {shippingTypes.map((shipping) => (
            <tr
              key={shipping.id}
              onClick={() => onShippingSelect && onShippingSelect(shipping)}
              style={{ cursor: "pointer" }}
            >
              <td>{shipping.name}</td>
              <td>{shipping.price}€</td>
              <td>
                <input type="checkbox" checked={shipping.active} readOnly />
              </td>
            </tr>
          ))}
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
        <ButtonSecondary
          aria-label={`Volver a la página anterior`}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </ButtonSecondary>
        <span>
          Página {page} de {totalPages}
        </span>
        <ButtonSecondary
          aria-label={`Ir a la siguiente página`}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Siguiente
        </ButtonSecondary>
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

export default AdminShippingTable;
