import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { ButtonPrimary, ButtonSecondary } from "../../components/Button";

const AdminProductsTable = ({ onProductSelect, onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [orderBy, setOrderBy] = useState("name");
  const [orderAsc, setOrderAsc] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useState("all");
  const [handmadeFilter, setHandmadeFilter] = useState("all");
  const [topVentas, setTopVentas] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      let countQuery = supabase
        .from("products")
        .select("id", { count: "exact" });

      if (filter === "active") {
        countQuery = countQuery.eq("active", true);
      } else if (filter === "inactive") {
        countQuery = countQuery.eq("active", false);
      }
      if (handmadeFilter === "yes") {
        countQuery = countQuery.eq("handmade", true);
      } else if (handmadeFilter === "no") {
        countQuery = countQuery.eq("handmade", false);
      }
      const { count } = await countQuery;
      setTotal(count || 0);

      let dataQuery = supabase
        .from("products")
        .select("*")
        .order(orderBy, { ascending: orderAsc });

      if (filter === "active") {
        dataQuery = dataQuery.eq("active", true);
      } else if (filter === "inactive") {
        dataQuery = dataQuery.eq("active", false);
      }
      if (handmadeFilter === "yes") {
        dataQuery = dataQuery.eq("handmade", true);
      } else if (handmadeFilter === "no") {
        dataQuery = dataQuery.eq("handmade", false);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data } = await dataQuery.range(from, to);

      setProducts(data || []);
    };
    fetchProducts();
  }, [page, pageSize, filter, handmadeFilter, orderBy, orderAsc]);

  useEffect(() => {
    const fetchTopVentas = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, sales_count")
        .order("sales_count", { ascending: false })
        .limit(3);
      setTopVentas(data || []);
    };
    fetchTopVentas();
  }, []);

  const handleHeaderClick = (col) => {
    if (orderBy === col) {
      setOrderAsc((asc) => !asc);
    } else {
      setOrderBy(col);
      setOrderAsc(true);
    }
  };

  const handleClick = (product) => {
    if (onProductSelect) onProductSelect(product);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSave = async () => {
    const { id, name, price, stock, active } = editForm;
    await supabase
      .from("products")
      .update({
        name,
        price: Number(price),
        stock: Number(stock),
        active: active === "false" || active === false ? false : true,
      })
      .eq("id", id);
    setEditingId(null);
    // Refresca la tabla
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data } = await supabase
      .from("products")
      .select("id, name, price, stock, active, sales_count")
      .order(orderBy, { ascending: orderAsc })
      .range(from, to);
    setProducts(data || []);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleClearFilters = () => {
    setFilter("all");
    setHandmadeFilter("all");
    setPage(1);
    setPageSize(5); // o el valor por defecto que prefieras
  };

  const totalPages = Math.ceil(total / pageSize);

  // Estadísticas de productos
  const active = products.filter((p) => p.active).length;

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
        <h2>Productos</h2>
        <ButtonSecondary onClick={onAddProduct} aria-label={`Añadir producto`}>
          Añadir producto
        </ButtonSecondary>
      </div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <label>
          Filtro:&nbsp;
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Todos</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </select>
        </label>
        <label>
          Hecho a mano:&nbsp;
          <select
            value={handmadeFilter}
            onChange={(e) => {
              setHandmadeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Todos</option>
            <option value="yes">Solo hechos a mano</option>
            <option value="no">Solo no hechos a mano</option>
          </select>
        </label>
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
      <div
        style={{
          marginBottom: 16,
          background: "#ede7f6",
          padding: 12,
          borderRadius: 8,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <span>
          <b>Total productos:</b> {total}
        </span>
        <span>
          <b>Activos:</b> {active}
        </span>
        {/* Cards para Sin stock */}
        {products.filter((p) => p.stock === 0).length > 0 && (
          <div>
            <b>Sin stock:</b>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 6,
                flexWrap: "wrap",
              }}
            >
              {products
                .filter((p) => p.stock === 0)
                .map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #e53935",
                      color: "#e53935",
                      borderRadius: 8,
                      padding: "8px 14px",
                      minWidth: 120,
                      boxShadow: "0 2px 8px #e5393533",
                      cursor: "pointer",
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                    onClick={() => handleClick(p)}
                    title="Ver producto"
                  >
                    {p.name}
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Cards para Poco stock */}
        {products.filter((p) => p.stock > 0 && p.stock <= 5).length > 0 && (
          <div>
            <b>Poco stock (≤5):</b>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 6,
                flexWrap: "wrap",
              }}
            >
              {products
                .filter((p) => p.stock > 0 && p.stock <= 5)
                .map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: "#fffde7",
                      border: "1px solid #fbc02d",
                      color: "#b28900",
                      borderRadius: 8,
                      padding: "8px 14px",
                      minWidth: 120,
                      boxShadow: "0 2px 8px #fbc02d33",
                      cursor: "pointer",
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                    onClick={() => handleClick(p)}
                    title="Ver producto"
                  >
                    {p.name}
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Cards para Top ventas */}
        {topVentas.length > 0 && (
          <div>
            <b>Top ventas:</b>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 6,
                flexWrap: "wrap",
              }}
            >
              {topVentas.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "#ede7f6",
                    border: "1.5px solid #5e35b1",
                    color: "#5e35b1",
                    borderRadius: 8,
                    padding: "8px 14px",
                    minWidth: 120,
                    boxShadow: "0 2px 8px #5e35b133",
                    cursor: "pointer",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                  onClick={() => handleClick(p)}
                  title={`Ventas: ${p.sales_count ?? 0}`}
                >
                  {p.name}{" "}
                  <span style={{ fontSize: 13 }}>({p.sales_count ?? 0})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <table className="admin-products-table">
        <thead>
          <tr>
            <th onClick={() => handleHeaderClick("name")}>
              Nombre {orderBy === "name" ? (orderAsc ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleHeaderClick("price")}>
              Precio {orderBy === "price" ? (orderAsc ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleHeaderClick("stock")}>
              Stock {orderBy === "stock" ? (orderAsc ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleHeaderClick("sales_count")}>
              Ventas {orderBy === "sales_count" ? (orderAsc ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleHeaderClick("active")}>
              Activo {orderBy === "active" ? (orderAsc ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleHeaderClick("handmade")}>
              Hecho a mano{" "}
              {orderBy === "handmade" ? (orderAsc ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) =>
            editingId === prod.id ? (
              <tr key={prod.id}>
                <td>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    name="price"
                    type="number"
                    value={editForm.price}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    name="stock"
                    type="number"
                    value={editForm.stock}
                    onChange={handleEditChange}
                  />
                </td>
                <td>{editForm.sales_count ?? 0}</td>
                <td>
                  <input
                    type="checkbox"
                    name="active"
                    checked={!!editForm.active}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        active: e.target.checked,
                      }))
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="handmade"
                    checked={!!editForm.handmade}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        handmade: e.target.checked,
                      }))
                    }
                  />
                </td>
                <td>
                  <ButtonPrimary
                    onClick={handleEditSave}
                    aria-label={`Guardar cambios en producto ${prod.name}`}
                  >
                    Guardar
                  </ButtonPrimary>
                  <ButtonSecondary
                    onClick={handleEditCancel}
                    aria-label={`Cancelar edición de producto ${prod.name}`}
                  >
                    Cancelar
                  </ButtonSecondary>
                </td>
              </tr>
            ) : (
              <tr key={prod.id} onClick={() => handleClick(prod)}>
                <td>{prod.name}</td>
                <td>{Number(prod.price).toFixed(2)} €</td>
                <td>{prod.stock}</td>
                <td>{prod.sales_count ?? 0}</td>
                <td>{prod.active ? "Sí" : "No"}</td>
                <td>{prod.handmade ? "Sí" : "No"}</td>
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
      <style>{`
        .admin-products-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1em;
        }
        .admin-products-table th, .admin-products-table td {
          border: 1px solid #d1c4e9;
          padding: 8px 12px;
          text-align: left;
        }
        .admin-products-table th {
          background: #ede7f6;
          cursor: pointer;
          user-select: none;
        }
        .admin-products-table tr:hover {
          background: #f3e5f5;
        }
        .admin-products-table input {
          width: 90%;
          padding: 4px;
        }
      `}</style>
    </div>
  );
};

export default AdminProductsTable;
