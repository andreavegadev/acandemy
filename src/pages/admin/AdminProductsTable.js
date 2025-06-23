import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  const handleHeaderClick = (col) => {
    if (orderBy === col) {
      setOrderAsc((asc) => !asc);
    } else {
      setOrderBy(col);
      setOrderAsc(true);
    }
  };

  const handleDoubleClick = (product) => {
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
        <button onClick={onAddProduct}>Añadir producto</button>
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
        <button onClick={handleClearFilters}>Limpiar filtros</button>
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
                  <button onClick={handleEditSave}>Guardar</button>
                  <button onClick={handleEditCancel}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={prod.id} onDoubleClick={() => handleDoubleClick(prod)}>
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
