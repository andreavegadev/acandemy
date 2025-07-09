export default function getCartLineId(product, personalizations = []) {
  const baseId = product.id;
  const personalizationPart = personalizations
    .map((p) => `${p.id}:${p.value || ""}`)
    .sort()
    .join("|"); // Sorting ensures uniqueness order doesn't matter
  return `${baseId}-${personalizationPart}`;
}
