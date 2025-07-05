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

  // Agrupar personalizaciones por tipo
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
      personalizations: [...selectedPersos],
      cartLineId: getCartLineId(product, selectedPersos),
      quantity,
    });
  };

  const handleChange = (e) => {
    const value = Math.max(1, Math.min(product.stock, Number(e.target.value)));
    setQuantity(value);
  };

  // Calcula el precio total sumando el producto base y las personalizaciones seleccionadas
  const totalPrice = React.useMemo(() => {
    if (!product) return 0;
    let sum = Number(product.price);
    Object.entries(selectedPersonalizations).forEach(([type, id]) => {
      const perso = personalizations.find((p) => p.id === Number(id));
      if (perso && perso.additional_price) {
        sum += Number(perso.additional_price);
      }
    });
    return sum * quantity;
  }, [product, selectedPersonalizations, personalizations, quantity]);

  if (loading) {
    return <p className="product-loading">Cargando detalles del producto...</p>;
  }

  if (!product) {
    return <p className="product-notfound">No se encontró el producto.</p>;
  }

  return (
    <div className="product-detail">
      <style>{`
        .product-detail {
          max-width: 900px;
          margin: 40px auto 0 auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px #e1bee7;
          padding: 32px 28px;
          font-size: 17px;
          color: #3a2e5c;
        }
        .product-detail h1 {
          margin-top: 0;
          color: #5e35b1;
          font-size: 2.1em;
          margin-bottom: 18px;
        }
        .product-detail-container {
          display: flex;
          gap: 36px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .product-detail-image {
          width: 320px;
          height: 320px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid #d1c4e9;
          background: #f3e5f5;
        }
        .product-detail-info {
          flex: 1;
          min-width: 260px;
        }
        .product-detail-info p {
          margin: 10px 0;
        }
        .personalization-block {
          margin: 22px 0 18px 0;
          padding: 16px 14px;
          background: #f8f6ff;
          border-radius: 10px;
          border: 1px solid #d1c4e9;
        }
        .personalization-block label {
          font-weight: 500;
          margin-bottom: 6px;
          display: block;
        }
        .personalization-block select {
          width: 100%;
          padding: 7px 10px;
          border-radius: 6px;
          border: 1px solid #b39ddb;
          margin-top: 4px;
          margin-bottom: 12px;
          font-size: 1em;
        }
        .personalization-block strong {
          color: #5e35b1;
        }
        .product-detail-info .quantity-block {
          margin: 18px 0 10px 0;
        }
        .product-detail-info input[type="number"] {
          width: 70px;
          padding: 5px 8px;
          border-radius: 6px;
          border: 1px solid #b39ddb;
          margin-left: 8px;
        }
        .add-to-cart-button {
          background: #7e57c2;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-size: 1.1em;
          margin-top: 18px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .add-to-cart-button:disabled {
          background: #bdbdbd;
          cursor: not-allowed;
        }
        .product-loading, .product-notfound {
          text-align: center;
          color: #7e57c2;
          margin-top: 60px;
          font-size: 1.3em;
        }
      `}</style>
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
            <strong>Hecho a mano:</strong> {product.handmade ? "Sí" : "No"}
          </p>
          {/* Picklists de personalizaciones agrupadas por tipo */}
          {Object.keys(groupedPersonalizations).length > 0 && (
            <div className="personalization-block">
              <strong>Personalizaciones:</strong>
              {Object.entries(groupedPersonalizations).map(([type, persos]) => (
                <div key={type} style={{ marginBottom: 10 }}>
                  <label>
                    {type}
                    {persos[0]?.personalization_type?.mandatory && (
                      <span style={{ color: "#e53935", marginLeft: 6 }}>*</span>
                    )}
                  </label>
                  <select
                    value={selectedPersonalizations[type] || ""}
                    onChange={(e) =>
                      handlePersonalizationChange(type, e.target.value)
                    }
                  >
                    <option value="">
                      Selecciona {type.toLowerCase()}
                      {persos[0]?.personalization_type?.mandatory ? " *" : ""}
                    </option>
                    {persos.map((perso) => (
                      <option key={perso.id} value={perso.id}>
                        {perso.name}
                        {perso.additional_price > 0
                          ? ` (+${Number(perso.additional_price).toFixed(2)}€)`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          <div className="quantity-block">
            <label htmlFor="quantity">
              Cantidad:
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleChange}
              />
              <span style={{ marginLeft: 8 }}>
                (Stock disponible: {product.stock})
              </span>
            </label>
          </div>
          <p>
            <strong>Precio total:</strong> €{totalPrice.toFixed(2)}
          </p>
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

function getCartLineId(product, personalizations) {
  const persoIds = (personalizations || [])
    .map((p) => `${p.type || ""}:${p.id}`)
    .sort()
    .join("|");
  return `${product.id}__${persoIds}`;
}

export default ProductDetailPage;
