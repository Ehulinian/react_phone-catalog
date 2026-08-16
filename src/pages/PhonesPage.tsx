import { Container } from '../components/Container';
import { DataState } from '../components/DataState';
import { ProductList } from '../components/ProductList';
import { ProductsIntro } from '../components/ProductsIntro';
import { ProductControls } from '../components/UI/ProductsControls';
import { Category } from '../types/Category';
import { useAppSelector } from '../store/hooks';
import { useGetProductsQuery } from '../store/products/productsApi';
import { useCategoryProducts } from '../hooks/useCategoryProducts';

export const PhonesPage = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();

  const searchTerm = useAppSelector(state => state.search.term);
  const category = Category.Phones;

  const { displayedProducts } = useCategoryProducts(products, category);

  const filtered = displayedProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading || isError) {
    return (
      <Container>
        <DataState
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          message="Couldn't load phones. Check your connection and try again."
        />
      </Container>
    );
  }

  return (
    <Container>
      <ProductsIntro category={category} />
      <ProductControls />
      <ProductList filteredProducts={filtered} />
    </Container>
  );
};
