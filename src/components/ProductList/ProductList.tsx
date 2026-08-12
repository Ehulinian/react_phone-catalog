import React, { useEffect, useMemo } from 'react';
import { ProductCard } from '../ProductCard';
import { Product } from '../../types/Product';
import styles from './ProductList.module.scss';
import { useSearchParams } from 'react-router-dom';
import { PerPageOption } from '../../types/Sort';
import { Pagination } from '../UI/Pagination';

interface ProductListProps {
  filteredProducts: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({
  filteredProducts,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = +(searchParams.get('page') || 1);
  const perPage = +(searchParams.get('perPage') || PerPageOption.Sixteen);

  const totalPages =
    perPage === PerPageOption.All
      ? 1
      : Math.max(1, Math.ceil(filteredProducts.length / perPage));

  // The URL's `page` can point past the end once the list shrinks — e.g. the
  // user is on page 4 and then types a search term that only matches 2
  // products. Without clamping, the slice below would come back empty and
  // show "No products available" even though matches exist on an earlier
  // page.
  const page = Math.min(Math.max(pageParam, 1), totalPages);

  // Keep the URL in sync once we've clamped — otherwise the address bar
  // would still say `page=5` while page 1 is what's actually shown, which
  // breaks the back button and link sharing.
  useEffect(() => {
    if (pageParam !== page) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        page: page.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam, page]);

  const visibleProducts = useMemo(() => {
    if (perPage === PerPageOption.All) {
      return filteredProducts;
    }

    const start = (page - 1) * perPage;

    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page, perPage]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: newPage.toString(),
    });
  };

  const isRegularShow = visibleProducts.some(
    product => product.fullPrice > product.price,
  );

  return (
    <div className={styles.phonesContainer}>
      {visibleProducts.length > 0 ? (
        <div className={styles.phonesWrapper}>
          {visibleProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              imageWrapperSize="large"
              classNames="responsive"
              showRegularPrice={isRegularShow}
            />
          ))}
        </div>
      ) : (
        <p>No products available</p>
      )}

      {perPage !== 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
