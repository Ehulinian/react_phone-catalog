import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductDetails } from '../components/ProductDetails/ProductDetails';
import { Container } from '../components/Container';
import { DataState } from '../components/DataState';
import {
  useGetCategoryProductsQuery,
  useGetProductsQuery,
} from '../store/products/productsApi';
import { RecommendedProducts } from '../components/RecommendedProducts';
import { getSuggestedProducts } from '../utils/getSuggestedProducts';

export const ProductDetailsPage = () => {
  const location = useLocation();
  const { productId } = useParams<{ productId: string }>();

  const category = location.pathname.split('/')[1];

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetProductsQuery();

  const {
    data: productsDetails = [],
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    refetch: refetchDetails,
  } = useGetCategoryProductsQuery(category, { skip: !category });

  const product = products.find(item => item.itemId === productId);
  const selectedProduct = productsDetails.find(item => item.id === productId);

  const recommendedProducts = useMemo(() => {
    return getSuggestedProducts(products, selectedProduct, 6);
  }, [products, selectedProduct]);

  const isLoading = isLoadingProducts || isLoadingDetails;
  const isError = isProductsError || isDetailsError;

  if (isLoading || isError) {
    return (
      <Container>
        <DataState
          isLoading={isLoading}
          isError={isError}
          onRetry={() => {
            refetchProducts();
            refetchDetails();
          }}
          message="Couldn't load this product. Check your connection and retry."
        />
      </Container>
    );
  }

  // Loaded successfully, but nothing matches this URL — a wrong or stale
  // product id rather than a network problem.
  if (!selectedProduct || !product) {
    return (
      <Container>
        <Breadcrumbs />
        <p className="notFoundMessage">Product was not found</p>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumbs name={selectedProduct.name} />

      <ProductDetails
        productDetails={selectedProduct}
        product={product}
        productVariants={productsDetails}
      />

      <RecommendedProducts recommendedProducts={recommendedProducts} />
    </Container>
  );
};
