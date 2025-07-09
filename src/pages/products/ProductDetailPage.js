import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../context/CartContext";
import styles from "./ProductDetailPage.module.css";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import Price from "../../components/Price";
import { Box, Stack } from "../../components/LayoutUtilities";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import Select from "../../components/Select";
import { ButtonPrimary } from "../../components/Button";
import { Counter } from "../../components/Counter";
import { Inline } from "../../components/LayoutUtilities";
import { StockIndicator } from "../../components/StockIndicator";

const ProductDetailPage = () => {
  const navigate = useNavigate();
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
        .select("*")
        .eq("name", name)
        .single();

      if (!productError) {
        setProduct(productData);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [name]);

  const ImagePreview = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const detailImage = images[activeIndex];

    useEffect(() => {
      if (images.length > 0) {
        setActiveIndex(0);
      }
    }, [images]);

    return (
      <div className={styles.imagePreview}>
        {/* Main detail image */}
        {detailImage && (
          <img
            src={detailImage.src}
            alt={detailImage.alt || "Imagen destacada"}
            className={styles.detailImage}
          />
        )}

        {/* Thumbnails */}
        <div className={styles.thumbnailContainer}>
          {images.map((img, index) => {
            const buttonStyles = `${styles.thumbnailButton} ${
              index === activeIndex ? styles.activeThumbnail : ""
            }`;
            return (
              <button
                onClick={() => setActiveIndex(index)}
                key={index}
                className={buttonStyles}
              >
                <img
                  src={img.src}
                  alt={img.alt || `Imagen ${index + 1}`}
                  className={`${styles.thumbnailImage} ${
                    img.src === detailImage?.src ? styles.activeThumbnail : ""
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

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
      category: product.category_id,
      personalizations: [...selectedPersos],
      cartLineId: getCartLineId(product, selectedPersos),
      quantity,
    });
  };

  const totalPrice = React.useMemo(() => {
    if (!product) return 0;
    let sum = Number(product.price);
    Object.entries(selectedPersonalizations).forEach(([type, id]) => {
      const perso = personalizations.find((p) => p.id === Number(id));
      if (perso && perso.additional_price) {
        sum += Number(perso.additional_price);
      }
    });
    return sum; // ← No quantity multiplication
  }, [product, selectedPersonalizations, personalizations]);

  if (loading) {
    return <p className="product-loading">Cargando detalles del producto...</p>;
  }

  if (!product) {
    return <p className="product-notfound">No se encontró el producto.</p>;
  }

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Stack gap={24}>
          <Breadcrumbs
            items={[
              { label: "Productos", onClick: () => navigate("/products") },
              {
                label: `${product.name}`,
                current: true,
              },
            ]}
          ></Breadcrumbs>

          <section
            aria-label="Configuración de producto"
            className={styles.productDetail}
          >
            <ImagePreview images={product.product_images} />

            <Stack gap={16}>
              <Heading>{product.name}</Heading>
              <Price amount={totalPrice} />
              {product.short_description && <p>{product.short_description}</p>}
              {/* Picklists de personalizaciones agrupadas por tipo */}
              {Object.keys(groupedPersonalizations).length > 0 && (
                <div className="personalization-block">
                  {Object.entries(groupedPersonalizations).map(
                    ([type, persos]) => (
                      <div key={type}>
                        <Select
                          name={type}
                          required={persos[0]?.personalization_type?.mandatory}
                          label={type}
                          value={selectedPersonalizations[type] || ""}
                          onChange={(e) =>
                            handlePersonalizationChange(type, e.target.value)
                          }
                          options={[
                            {
                              value: "",
                              label:
                                "--Selecciona " + type.toLowerCase() + "--",
                            },
                            ...persos.map((perso) => ({
                              value: perso.id,
                              label:
                                perso.name +
                                (perso.additional_price > 0
                                  ? ` (+${Number(
                                      perso.additional_price
                                    ).toFixed(2)}€)`
                                  : ""),
                            })),
                          ]}
                        />
                      </div>
                    )
                  )}
                </div>
              )}
              <div>
                <StockIndicator stock={product.stock} />
              </div>
              <div className={styles.actions}>
                <Counter
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={product.stock}
                  fullWidth
                />
                <ButtonPrimary
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  aria-label={`Añadir ${product.name} al carrito`}
                  fullWidth
                  forceDesktopFullWidth
                >
                  Añadir al carrito
                </ButtonPrimary>
              </div>
            </Stack>
          </section>
          <hr></hr>
          <section
            aria-label="especificaciones"
            className={styles.productDescription}
          >
            <p>
              <strong>Descripción:</strong> <span>{product.description}</span>
            </p>
            <p>
              <strong>Hecho a mano:</strong> {product.handmade ? "Sí" : "No"}
            </p>
          </section>
        </Stack>
      </Box>
    </ResponsiveLayout>
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
