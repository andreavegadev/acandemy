import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../context/CartContext";
import "../../styles/ProductDetail.css";

const ProductDetailPage = () => {
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const [personalizations, setPersonalizations] = useState([]);
  const [selectedPersonalizations, setSelectedPersonalizations] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name, description, price, photo_url, stock, handmade")
        .eq("name", name)
        .single();

      if (!productError) {
        setProduct(productData);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [name]);

  // Cargar personalizaciones del producto con su tipo
  useEffect(() => {
    const fetchPersonalizations = async () => {
      if (!product?.id) return;
      const { data, error } = await supabase
        .from("personalizations")
        .select(
          "id, name, personalization_type:personalization_types(name, mandatory), additional_price"
        )
        .eq("product_id", product.id)
        .eq("active", true);
      if (!error) setPersonalizations(data || []);
    };
    fetchPersonalizations();
  }, [product]);

  const groupedPersonalizations = React.useMemo(() => {
    const acc = {};
    for (const perso of personalizations) {
      const type = perso.personalization_type?.name || "Otro";
      if (!acc[type]) acc[type] = [];
      acc[type].push(perso);
    }
    return acc;
  }, [personalizations]);

  const handlePersonalizationChange = (type, value) => {
    setSelectedPersonalizations((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddToCart = () => {
    const mandatoryTypes = Object.entries(groupedPersonalizations)
      .filter(([type, persos]) => persos[0]?.personalization_type?.mandatory)
      .map(([type]) => type);

    const missingMandatory = mandatoryTypes.filter(
      (type) => !selectedPersonalizations[type]
    );

    if (missingMandatory.length > 0) {
      alert(
        `Debes seleccionar una opción para las siguientes personalizaciones: ${missingMandatory.join(
          ", "
        )}`
      );
      return;
    }

    const selectedPersos = Object.entries(selectedPersonalizations)
      .map(([type, id]) => personalizations.find((p) => p.id === Number(id)))
      .filter(Boolean);

    addToCart({
      ...product,
      price: Number(product.price),
      quantity,
      personalizations: selectedPersos.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.personalization_type?.name,
        additional_price: p.additional_price,
      })),
    });
  };

  const handleChange = (e) => {
    const value = Math.max(1, Math.min(product.stock, Number(e.target.value)));
    setQuantity(value);
  };

  if (loading) {
    return <p>Cargando detalles del producto...</p>;
  }

  if (!product) {
    return <p>No se encontró el producto.</p>;
  }

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <div className="product-detail-container">
        <img
          src={product.photo_url || "/path/to/default-image.jpg"}
          alt={product.name}
          className="product-detail-image"
        />
        <div className="product-detail-info">
          <p>
            <strong>Descripción:</strong> {product.description}
          </p>
          <p>
            <strong>Precio:</strong> €{product.price.toFixed(2)}
          </p>
          <p>
            <strong>Stock disponible:</strong> {product.stock}
          </p>
          <p>
            <strong>Hecho a mano:</strong> {product.handmade ? "Sí" : "No"}
          </p>
          {/* Picklists de personalizaciones agrupadas por tipo */}
          {Object.keys(groupedPersonalizations).length > 0 && (
            <div style={{ margin: "18px 0" }}>
              <strong>Personalizaciones:</strong>
              {Object.entries(groupedPersonalizations).map(([type, persos]) => (
                <div key={type} style={{ marginBottom: 10 }}>
                  <label>
                    {type}:
                    <select
                      value={selectedPersonalizations[type] || ""}
                      onChange={(e) =>
                        handlePersonalizationChange(type, e.target.value)
                      }
                      style={{ marginLeft: 8 }}
                    >
                      <option value="">Selecciona {type.toLowerCase()}</option>
                      {persos.map((perso) => (
                        <option key={perso.id} value={perso.id}>
                          {perso.name}
                          {perso.additional_price > 0
                            ? ` (+${Number(perso.additional_price).toFixed(
                                2
                              )}€)`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          )}
          <div>
            <label htmlFor="quantity">Cantidad:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleChange}
            />
            <span> (Stock disponible: {product.stock})</span>
          </div>
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
