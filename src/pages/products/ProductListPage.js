import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ProductCard from "../../components/ProductCard";

const ProductListPage = () => {
  const { category } = useParams(); // Extract category name from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        let categoryId = null;

        // If a category name is provided, fetch its ID
        if (category) {
          const { data: categoryData, error: categoryError } = await supabase
            .from("categories")
            .select("id")
            .eq("name", category)
            .single();

          if (categoryError) {
            console.error("Error fetching category:", categoryError.message);
            setProducts([]); // Clear products if category is invalid
            setLoading(false);
            return;
          }

          categoryId = categoryData?.id;
        }

        // Fetch products based on the category ID or fetch all products
        let query = supabase
          .from("products")
          .select("id, name, description, price, photo_url");

        if (categoryId) {
          query = query.eq("category_id", categoryId);
        }

        const { data: productsData, error: productsError } = await query;

        if (productsError) {
          console.error("Error fetching products:", productsError.message);
        } else {
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="product-list">
      <h1>
        {category
          ? `Productos en la categoría: ${category}`
          : "Todos los productos"}
      </h1>
      <div className="product-cards">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.name}
              description={product.description}
              price={`€${product.price.toFixed(2)}`}
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
