import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ProductCard from "../../components/ProductCard";

const ProductListPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: null, name: "Todos" }]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");

  // Cargar categorías dinámicamente
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) {
        console.error("Error fetching categories:", error.message);
      } else {
        setCategories([{ id: null, name: "Todos" }, ...data]);
      }
    };
    fetchCategories();
  }, []);

  // Cargar productos según la categoría seleccionada o URL
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let categoryId = null;

        // Si hay categoría en la URL, priorízala
        if (category) {
          const { data: categoryData, error: categoryError } = await supabase
            .from("categories")
            .select("id")
            .eq("name", category)
            .single();

          if (categoryError) {
            console.error("Error fetching category:", categoryError.message);
            setProducts([]);
            setLoading(false);
            return;
          }
          categoryId = categoryData?.id;
          setSelectedCategory(category); // Sincroniza chip con URL
        } else if (selectedCategory !== "Todos") {
          // Si no hay categoría en la URL, usa la seleccionada en el chip
          const cat = categories.find((c) => c.name === selectedCategory);
          if (cat) categoryId = cat.id;
        }

        let query = supabase
          .from("products")
          .select("id, name, description, price, photo_url, category_id");

        if (categoryId) {
          query = query.eq("category_id", categoryId);
        }

        const { data: productsData, error: productsError } = await query;

        if (productsError) {
          console.error("Error fetching products:", productsError.message);
          setProducts([]);
        } else {
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
    // eslint-disable-next-line
  }, [category, selectedCategory, categories]);

  // Filtro combinado
  const filteredProducts = products
    .filter((p) =>
      minPrice === "" ? true : Number(p.price) >= Number(minPrice)
    )
    .filter((p) =>
      maxPrice === "" ? true : Number(p.price) <= Number(maxPrice)
    )
    .filter((p) =>
      search === ""
        ? true
        : p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="product-list">
      <h1>
        {selectedCategory === "Todos"
          ? "Todos los productos"
          : `Productos en la categoría: ${selectedCategory}`}
      </h1>
      {/* Filtros */}
      <div style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 16 }}>
        {/* Chips de categoría */}
        <div>
          {categories.map((cat) => (
            <button
              key={cat.id ?? "todos"}
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                display: "inline-block",
                marginRight: 10,
                marginBottom: 10,
                padding: "8px 18px",
                borderRadius: 20,
                border: "none",
                background: selectedCategory === cat.name ? "#5e35b1" : "#ede7f6",
                color: selectedCategory === cat.name ? "#fff" : "#5e35b1",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: selectedCategory === cat.name ? "0 2px 8px #b39ddb55" : "none",
                transition: "background 0.2s"
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {/* Filtro por precio */}
        <div style={{
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#f3e5f5",
  borderRadius: 20,
  padding: "6px 18px",
  marginRight: 16,
  boxShadow: "0 1px 4px #b39ddb33"
}}>
  <span style={{ color: "#5e35b1", fontWeight: 600, marginRight: 6 }}>Precio:</span>
  <input
    type="number"
    min="0"
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
    placeholder="Mín"
    style={{
      width: 70,
      border: "1px solid #d1c4e9",
      borderRadius: 8,
      padding: "4px 8px",
      marginRight: 4,
      background: "#fff",
      color: "#5e35b1"
    }}
  />
  <span style={{ color: "#5e35b1" }}>-</span>
  <input
    type="number"
    min="0"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    placeholder="Máx"
    style={{
      width: 70,
      border: "1px solid #d1c4e9",
      borderRadius: 8,
      padding: "4px 8px",
      marginLeft: 4,
      background: "#fff",
      color: "#5e35b1"
    }}
  />
  <span style={{ color: "#5e35b1", marginLeft: 4 }}>€</span>
</div>
        {/* Filtro por texto */}
        <div>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1c4e9" }}
          />
        </div>
      </div>
      {/* Listado de productos */}
      <div className="product-cards">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              description={product.description}
              price={product.price}
              image={product.photo_url}
              linkDetails={`/product/${encodeURIComponent(product.name)}`}
            />
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
