import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const AdminCategoriesTable = ({ onAddCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      let query = supabase
        .from("categories")
        .select("*", { count: "exact" })
        .order("name", { ascending: true });

      if (search.length > 1) {
        query = query.ilike("name", `%${search}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, count } = await query.range(from, to);

      setCategories(data || []);
      setTotal(count || 0);
      setLoading(false);
    };
    fetchCategories();
  }, [search, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleClearFilters = () => {
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
        <h2>Categorías</h2>
        <button onClick={onAddCategory}>Añadir categoría</button>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <input
          type="text"
          placeholder="Buscar categoría"
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
        <button onClick={handleClearFilters}>Limpiar filtros</button>
      </div>
      <table className="admin-products-table">
        <thead>
          <tr>
            <th>Icono</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Destacada</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4}>Cargando...</td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td colSpan={4}>Sin categorías</td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.id} onClick={() => onCategorySelect(cat)}>
                <td>{cat.icon || "-"}</td>
                <td>{cat.name}</td>
                <td>{cat.description || "-"}</td>
                <td>{cat.featured ? "Sí" : "No"}</td>
              </tr>
            ))
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
      </div>
    </div>
  );
};

export default AdminCategoriesTable;
