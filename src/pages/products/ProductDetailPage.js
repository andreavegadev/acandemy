import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useCart } from "../../context/CartContext";
import getCartLineId from "../../utils/getCartLineId";
import styles from "./ProductDetailPage.module.css";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import Price from "../../components/Price";
import { Box, Stack, Inline } from "../../components/LayoutUtilities";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import Select from "../../components/Select";
import { ButtonPrimary } from "../../components/Button";
import { Counter } from "../../components/Counter";
import { StockIndicator } from "../../components/StockIndicator";
import Text from "../../components/Text";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [personalizations, setPersonalizations] = useState([]);
  const [selectedPersonalizations, setSelectedPersonalizations] = useState({});

  const { addToCart, isProductMaxed } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("name", name)
        .single();

      if (!error) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [name]);

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
        `Debes seleccionar una opción para: ${missingMandatory.join(", ")}`
      );
      return;
    }

    const selectedPersos = Object.entries(selectedPersonalizations)
      .map(([type, id]) => {
        const found = personalizations.find((p) => p.id === Number(id));
        return found ? { ...found, value: type } : null;
      })
      .filter(Boolean);

    const cartLineId = getCartLineId(product, selectedPersos);

    addToCart({
      ...product,
      category: product.category_id,
      personalizations: selectedPersos,
      cartLineId,
      quantity,
    });
  };

  const totalPrice = React.useMemo(() => {
    if (!product) return 0;
    let sum = Number(product.price);
    Object.entries(selectedPersonalizations).forEach(([type, id]) => {
      const perso = personalizations.find((p) => p.id === Number(id));
      if (perso?.additional_price) {
        sum += Number(perso.additional_price);
      }
    });
    return sum;
  }, [product, selectedPersonalizations, personalizations]);

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
        {detailImage && (
          <img
            src={detailImage.src}
            alt={detailImage.alt || "Imagen destacada"}
            className={styles.detailImage}
          />
        )}
        <div className={styles.thumbnailContainer}>
          {images.map((img, index) => (
            <button
              onClick={() => setActiveIndex(index)}
              key={index}
              className={`${styles.thumbnailButton} ${
                index === activeIndex ? styles.activeThumbnail : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt || `Imagen ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <p>Cargando detalles del producto...</p>;
  }

  if (!product) {
    return <p>No se encontró el producto.</p>;
  }

  return (
    <ResponsiveLayout>
      <Box paddingY={48}>
        <Stack gap={24}>
          <Breadcrumbs
            items={[
              { label: "Productos", onClick: () => navigate("/products") },
              { label: product.name, current: true },
            ]}
          />
          <section className={styles.productDetail}>
            <ImagePreview images={product.product_images} />
            <Stack gap={16}>
              <Heading>{product.name}</Heading>
              <Price amount={totalPrice} />
              {product.short_description && <p>{product.short_description}</p>}
              {Object.keys(groupedPersonalizations).length > 0 && (
                <div>
                  {Object.entries(groupedPersonalizations).map(
                    ([type, persos]) => (
                      <Select
                        key={type}
                        name={type}
                        label={type}
                        value={selectedPersonalizations[type] || ""}
                        onChange={(e) =>
                          handlePersonalizationChange(type, e.target.value)
                        }
                        required={persos[0]?.personalization_type?.mandatory}
                        options={[
                          {
                            value: "",
                            label: "--Selecciona " + type.toLowerCase() + "--",
                          },
                          ...persos.map((p) => ({
                            value: p.id,
                            label: `${p.name}${
                              p.additional_price > 0
                                ? ` (+${Number(p.additional_price).toFixed(
                                    2
                                  )}€)`
                                : ""
                            }`,
                          })),
                        ]}
                      />
                    )
                  )}
                </div>
              )}
              <StockIndicator stock={product.stock} />
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
                  disabled={product.stock === 0 || isProductMaxed(product)}
                  fullWidth
                  forceDesktopFullWidth
                >
                  Añadir al carrito
                </ButtonPrimary>
              </div>
              {isProductMaxed(product) && (
                <Inline gap={8} align="center">
                  <Text>Tienes el máximo de este producto en tu carrito. <Link to="/cart">Ver carrito</Link></Text>             
                </Inline>
              )}
            </Stack>
          </section>
          <hr />
          <section className={styles.productDescription}>
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

export default ProductDetailPage;
