import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ProductCard from "../../components/ProductCard";
import "../../styles/Products.css"; // Asegúrate de tener estilos para el listado de productos
import Heading from "../../components/Heading";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import Chip from "../../components/Chip";
import {
  Inline,
  Stack,
  Box,
  HorizontalScroll,
} from "../../components/LayoutUtilities";

const ProductListPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: null, name: "Todos" }]);
  const [selectedCategory, setSelectedCategory] = useState(category || "Todos");
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
            return;
          }
          categoryId = categoryData?.id;
          setSelectedCategory(category);
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
    };

    fetchProducts();
    // eslint-disable-next-line
  }, [category, selectedCategory, categories]);

  // Efecto para actualizar la categoría seleccionada cuando cambia la URL
  useEffect(() => {
    setSelectedCategory(category || "Todos");
  }, [category]);

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
          (p.description &&
            p.description.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Stack gap={32}>
          <Heading>
            {selectedCategory === "Todos"
              ? "Todos los productos"
              : `Productos en la categoría: ${selectedCategory}`}
          </Heading>
          {/* Filtros */}
          <Stack>
            <Inline justify="space-between" wrap>
              {/* Chips de categoría */}
              <HorizontalScroll>
                <Inline>
                  {categories.map((cat) => (
                    <Chip
                      label={cat.name}
                      key={cat.id ?? "todos"}
                      onClick={() => {
                        if (cat.name === "Todos") {
                          navigate("/products");
                        } else {
                          navigate(`/products/${encodeURIComponent(cat.name)}`);
                        }
                      }}
                      active={
                        selectedCategory === cat.name ||
                        (cat.name === "Todos" && selectedCategory === "Todos")
                      }
                    ></Chip>
                  ))}
                </Inline>
              </HorizontalScroll>

              {/* Filtro por texto */}
              <div>
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #d1c4e9",
                  }}
                />
              </div>
            </Inline>

            {/* Filtro por precio */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f3e5f5",
                borderRadius: 20,
                padding: "6px 18px",
                marginRight: 16,
                boxShadow: "0 1px 4px #b39ddb33",
              }}
            >
              <span
                style={{ color: "#5e35b1", fontWeight: 600, marginRight: 6 }}
              >
                Precio:
              </span>
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
                  color: "#5e35b1",
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
                  color: "#5e35b1",
                }}
              />
              <span style={{ color: "#5e35b1", marginLeft: 4 }}>€</span>
            </div>
          </Stack>

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
                  //image={product.photo_url}
                  image={{
                    src: `https://picsum.photos/200/300`,
                  }}
                  linkDetails={`/product/${encodeURIComponent(product.name)}`}
                />
              ))
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </div>
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
};

export default ProductListPage;
