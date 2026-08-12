import { Container } from '../components/Container';
import { ProductList } from '../components/ProductList';
import { ProductsIntro } from '../components/ProductsIntro';
import { ProductControls } from '../components/UI/ProductsControls';
import { Category } from '../types/Category';
import { useAppSelector } from '../store/hooks';
import { useGetProductsQuery } from '../store/products/productsApi';
import { useCategoryProducts } from '../hooks/useCategoryProducts';

export const AccessoriesPage = () => {
  const { data: products = [] } = useGetProductsQuery();
  const searchTerm = useAppSelector(state => state.search.term);
  const category = Category.Accessories;

  const { displayedProducts } = useCategoryProducts(products, category);

  const filtered = displayedProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container>
      <ProductsIntro category={category} />
      <ProductControls />
      <ProductList filteredProducts={filtered} />
    </Container>
  );
};
