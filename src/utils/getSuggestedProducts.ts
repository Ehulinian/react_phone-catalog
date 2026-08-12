import { Product, ProductSpecs } from '../types/Product';

export const getSuggestedProducts = (
  products: Product[],
  currentProduct?: ProductSpecs,
  limit = 6,
): Product[] => {
  if (!products.length) {
    return [];
  }

  const isRelatedProduct = (p: Product) =>
    !currentProduct ||
    (p.id !== currentProduct.id && p.category === currentProduct.category);

  const filtered = currentProduct
    ? products.filter(isRelatedProduct)
    : products;

  const shuffled = [...filtered];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit);
};
