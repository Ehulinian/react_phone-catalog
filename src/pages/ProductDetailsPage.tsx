import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductDetails } from '../components/ProductDetails/ProductDetails';
import { Loader } from '../components/Loader';
import { Container } from '../components/Container';
import {
  useGetCategoryProductsQuery,
  useGetProductsQuery,
} from '../store/products/productsApi';
import { RecommendedProducts } from '../components/RecommendedProducts';
import { getSuggestedProducts } from '../utils/getSuggestedProducts';

export const ProductDetailsPage = () => {
  const location = useLocation();
  const { productId } = useParams<{ productId: string }>();
  const { data: products = [] } = useGetProductsQuery();

  const category = location.pathname.split('/')[1];

  const {
    data: productsDetails = [],
    isLoading,
    isError,
  } = useGetCategoryProductsQuery(category, { skip: !category });

  const product = products.find(item => item.itemId === productId);
  const selectedProduct = productsDetails.find(item => item.id === productId);

  const recommendedProducts = useMemo(() => {
    return getSuggestedProducts(products, selectedProduct, 6);
  }, [products, selectedProduct]);

  const { name } = selectedProduct || {};

  const showProductDetails = !isLoading && selectedProduct && product;

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <Container>
        <p>
          Something went wrong while loading this product. Please try again.
        </p>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Breadcrumbs name={name} />

        {showProductDetails && (
          <ProductDetails
            productDetails={selectedProduct}
            product={product}
            productVariants={productsDetails}
          />
        )}

        <RecommendedProducts recommendedProducts={recommendedProducts} />
      </Container>
    </>
  );
};
