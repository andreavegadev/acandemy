import styles from "./ProductListPage.module.css";
import { useState, useEffect, useId } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ProductCard from "../../components/ProductCard";
import "../../styles/Products.css";
import Heading from "../../components/Heading";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import Chip from "../../components/Chip";
import {
  Inline,
  Stack,
  Box,
  HorizontalScroll,
} from "../../components/LayoutUtilities";
import { useCart } from "../../context/CartContext";
import useProductCardActions from "../../hooks/useProductCartActions";
import Toast from "../../components/Toast";
import { ButtonPrimary, IconButton } from "../../components/Button";
import Input from "../../components/Input";
import Tag from "../../components/Tag";

const ProductListPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: null, name: "Todos" }]);
  const [selectedCategory, setSelectedCategory] = useState(category || "Todos");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const advancedFilterId = useId();

  const { addToCart, cart } = useCart();

  const {
    getProductQuantityInCart,
    isProductOutOfStockOrMaxedInCart,
    handleAddToCart,
  } = useProductCardActions({
    setToastMessage,
    setShowToast,
  });

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let categoryId = null;

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
          const cat = categories.find((c) => c.name === selectedCategory);
          if (cat) categoryId = cat.id;
        }

        let query = supabase
          .from("products")
          .select(
            "id, name, description, price, product_images, category_id, stock, order_customized"
          );

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
  }, [category, selectedCategory, categories]);

  useEffect(() => {
    setSelectedCategory(category || "Todos");
  }, [category]);

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

  const renderPrimaryAction = (product) => {
    const disabled = isProductOutOfStockOrMaxedInCart(product);

    if (product.order_customized) {
      return (
        <ButtonPrimary
          small
          disabled={disabled}
          onClick={() =>
            navigate(`/product/${encodeURIComponent(product.name)}`)
          }
        >
          Personalizar
        </ButtonPrimary>
      );
    }

    return (
      <ButtonPrimary
        small
        disabled={disabled}
        onClick={() => handleAddToCart(product)}
      >
        Añadir al Carrito
      </ButtonPrimary>
    );
  };

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Stack gap={32}>
          <Heading>
            {selectedCategory === "Todos"
              ? "Todos los productos"
              : `${selectedCategory}`}
          </Heading>

          {/* Filtros */}
          <Stack gap={16}>
            <Inline justify="space-between" wrap fullWidth>
              <HorizontalScroll>
                <Inline>
                  {categories.map((cat) => (
                    <Chip
                      key={cat.id ?? "todos"}
                      label={cat.name}
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
                    />
                  ))}
                </Inline>
              </HorizontalScroll>

              <div className={styles.advancedFilters}>
                <Input
                  type="text"
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  fullWidth
                />
                <IconButton
                  onClick={() => setActiveFilters(!activeFilters)}
                  aria-expanded={activeFilters ? "true" : "false"}
                  aria-controls={advancedFilterId}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="inherit"
                  >
                    <g data-name="Layer 2">
                      <g data-name="options-2">
                        <rect
                          width="24"
                          height="24"
                          transform="rotate(90 12 12)"
                          opacity="0"
                        ></rect>
                        <path d="M19 9a3 3 0 0 0-2.82 2H3a1 1 0 0 0 0 2h13.18A3 3 0 1 0 19 9zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"></path>
                        <path d="M3 7h1.18a3 3 0 0 0 5.64 0H21a1 1 0 0 0 0-2H9.82a3 3 0 0 0-5.64 0H3a1 1 0 0 0 0 2zm4-2a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"></path>
                        <path d="M21 17h-7.18a3 3 0 0 0-5.64 0H3a1 1 0 0 0 0 2h5.18a3 3 0 0 0 5.64 0H21a1 1 0 0 0 0-2zm-10 2a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"></path>
                      </g>
                    </g>
                  </svg>
                </IconButton>
              </div>
            </Inline>

            {/* Filtro por precio */}
            {activeFilters && (
              <div id={advancedFilterId}>
                <Stack gap={16}>
                  <Heading as="h3">Filtros Avanzados</Heading>
                  <Stack gap={8}>
                    <Heading as="h4">Filtrar por precio</Heading>
                    <Inline align="center" gap={16}>
                      <Input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Mín"
                        fullWidth
                      />
                      <Input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Máx"
                        fullWidth
                      />
                    </Inline>
                  </Stack>
                </Stack>
              </div>
            )}
          </Stack>

          {/* Productos */}
          <div className="product-cards">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  tag={
                    product.stock === 0 ? (
                      <Tag type="warning">Agotado</Tag>
                    ) : null
                  }
                  title={product.name}
                  description={
                    product.description
                      ? product.description.split(" ").slice(0, 15).join(" ") +
                        (product.description.split(" ").length > 15
                          ? "..."
                          : "")
                      : ""
                  }
                  price={product.price}
                  customized={product.order_customized}
                  image={product.product_images?.[0]?.src || ""}
                  stock={product.stock}
                  linkDetails={`/product/${encodeURIComponent(product.name)}`}
                  primaryAction={renderPrimaryAction(product)}
                  category={product.category_id}
                />
              ))
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </div>
        </Stack>
      </Box>
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          action={{ label: "Ver carrito", href: "/cart" }}
        />
      )}
    </ResponsiveLayout>
  );
};

export default ProductListPage;
