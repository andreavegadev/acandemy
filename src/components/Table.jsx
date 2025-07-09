import React, { useState } from "react";
import styles from "./Table.module.css";
import { ButtonPrimary, ButtonSecondary } from "./Button";
import Heading from "./Heading";
import Price from "./Price";
import Select from "./Select";
import Input from "./Input";
import { Inline } from "./LayoutUtilities";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 1000];

const COLUMN_LABELS = {
  id: "ID",
  name: "Nombre",
  price: "Precio",
  stock: "Stock",
  active: "Activo",
  handmade: "Hecho a mano",
  sales_count: "Ventas",
};

const Table = ({
  title,
  items,
  onClickAdd,
  onClick,
  filters = [],
  addItems,
}) => {
  const [filterValues, setFilterValues] = useState(
    filters.reduce((acc, filter) => {
      if (filter.type === "number") {
        acc[`${filter.key}_min`] = "";
        acc[`${filter.key}_max`] = "";
      } else {
        acc[filter.key] = "";
      }
      return acc;
    }, {})
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Ordenar los items según la columna y dirección seleccionada
  const sortedItems = React.useMemo(() => {
    if (!sortConfig.key) return items;
    const sorted = [...items].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || bValue === undefined) return 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
      return sortConfig.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [items, sortConfig]);

  // Filtrado
  const filteredItems = sortedItems.filter((item) =>
    filters.every((filter) => {
      const field = filter.field || filter.key;

      // Filtro number (debe evaluarse aunque value esté vacío)
      if (filter.type === "number") {
        const min = filterValues[`${filter.key}_min`];
        const max = filterValues[`${filter.key}_max`];
        const fieldValue = Number(
          typeof item[field] === "string"
            ? item[field].replace(/[^\d.-]+/g, "")
            : item[field]
        );
        if (min !== "" && !isNaN(Number(min)) && fieldValue < Number(min))
          return false;
        if (max !== "" && !isNaN(Number(max)) && fieldValue > Number(max))
          return false;
        return true;
      }

      const value = filterValues[filter.key];
      if (!value || (Array.isArray(value) && value.length === 0)) return true;

      // Filtro multiselect
      if (filter.type === "multiselect") {
        return value.includes(String(item[field]));
      }
      // Filtro select
      if (filter.type === "select") {
        if (value === "all" || value === "") return true;
        return String(item[field]) === value;
      }
      // Filtro fecha desde
      if (filter.type === "dateFrom") {
        if (!item[field]) return true;
        return new Date(item[field]) >= new Date(value);
      }
      // Filtro fecha hasta
      if (filter.type === "dateTo") {
        if (!item[field]) return true;
        return new Date(item[field]) <= new Date(value + "T23:59:59.999Z");
      }
      // Filtro texto
      if (typeof value === "string") {
        return String(item[field]).toLowerCase().includes(value.toLowerCase());
      }
      return true;
    })
  );

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleFilterChange = (e, key) => {
    setFilterValues({ ...filterValues, [key]: e.target.value });
    setPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Alterna entre asc, desc y sin orden
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <>
      {title && <Heading>{title}</Heading>}
      {addItems && onClickAdd && (
        <ButtonPrimary
          onClick={onClickAdd}
          aria-label={`Añadir ${title && title.toLowerCase()}`}
        >
          Añadir {title && title.toLowerCase()}
        </ButtonPrimary>
      )}
      {filters.length > 0 && (
        <div className={styles.filters}>
          {filters.map((filter) => {
            // Filtro de fecha desde
            if (filter.type === "dateFrom") {
              return (
                <Input
                  key={filter.key}
                  label={filter.label || "Fecha desde"}
                  type="date"
                  value={filterValues[filter.key]}
                  onChange={(e) => handleFilterChange(e, filter.key)}
                />
              );
            }
            // Filtro de fecha hasta
            if (filter.type === "dateTo") {
              return (
                <Input
                  key={filter.key}
                  label={filter.label || "Fecha hasta"}
                  type="date"
                  value={filterValues[filter.key]}
                  onChange={(e) => handleFilterChange(e, filter.key)}
                />
              );
            }
            // Filtro multiselect
            if (filter.type === "multiselect") {
              return (
                <Select
                  multiple
                  key={filter.key}
                  label={filter.label || filter.key}
                  name={filter.key}
                  value={filterValues[filter.key] || []}
                  onChange={(selected) => {
                    setFilterValues({
                      ...filterValues,
                      [filter.key]: selected,
                    });
                    setPage(1);
                  }}
                  options={filter.options || []}
                />
              );
            }
            // Filtro select
            if (filter.type === "select") {
              return (
                <Select
                  key={filter.key}
                  label={filter.label || filter.key}
                  name={filter.key}
                  value={filterValues[filter.key]}
                  onChange={(value) => handleFilterChange(value, filter.key)}
                  options={[
                    { value: "all", label: "Todos" },
                    ...(filter.options || []),
                  ]}
                />
              );
            }
            if (filter.type === "number") {
              return (
                <div key={filter.key} className={styles.minMaxFilter}>
                  <Input fullWidth
                    type="number"
                    label={(filter.label || filter.key) + " mín"}
                    value={filterValues[`${filter.key}_min`] || ""}
                    onChange={(e) => handleFilterChange(e, `${filter.key}_min`)}
                  />
                  <Input fullWidth
                    type="number"
                    label={(filter.label || filter.key) + " máx"}
                    value={filterValues[`${filter.key}_max`] || ""}
                    onChange={(e) => handleFilterChange(e, `${filter.key}_max`)}
                  />
                </div>
              );
            }
            return (
              <Input
                key={filter.key}
                type="text"
                label={filter.label || filter.key}
                value={filterValues[filter.key]}
                onChange={(e) => handleFilterChange(e, filter.key)}
              />
            );
          })}
          <ButtonSecondary
            onClick={() => {
              setFilterValues(
                filters.reduce((acc, filter) => {
                  if (filter.type === "number") {
                    acc[`${filter.key}_min`] = "";
                    acc[`${filter.key}_max`] = "";
                  } else {
                    acc[filter.key] = "";
                  }
                  return acc;
                }, {})
              );
              setPage(1);
            }}
          >
            Limpiar
          </ButtonSecondary>
        </div>
      )}

      <div className={styles.tableresponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              {Object.keys(items[0] || {}).map((key) => (
                <th key={key} onClick={() => handleSort(key)}>
                  {COLUMN_LABELS[key] || key}
                  {sortConfig.key === key
                    ? sortConfig.direction === "asc"
                      ? " ▲"
                      : " ▼"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, index) => (
              <tr key={index} onClick={() => onClick && onClick(item)}>
                {Object.entries(item).map(([key, value], idx) => (
                  <td key={idx}>
                    {typeof value === "boolean" ? (
                      value ? (
                        "Sí"
                      ) : (
                        "No"
                      )
                    ) : key === "price" ? (
                      <Price amount={value} />
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={Object.keys(items[0] || {}).length}>
                <div>
                  <span>
                    <b>{filteredItems.length}</b> items encontrados
                  </span>
                  <span>
                    <Select
                      label={"Items por página:"}
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      options={PAGE_SIZE_OPTIONS.map((opt) => ({
                        value: opt,
                        label: opt,
                      }))}
                    />
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {totalPages > 1 && (
        <div>
          <ButtonSecondary
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </ButtonSecondary>
          <span>
            Página {page} de {totalPages}
          </span>
          <ButtonSecondary
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
                const val = Number(e.target.value);
                if (val >= 1 && val <= totalPages) setPage(val);
              }}
            />
          </span>
        </div>
      )}
    </>
  );
};

export default Table;
