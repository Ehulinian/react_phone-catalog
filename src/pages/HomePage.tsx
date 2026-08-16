import React from 'react';
import { Intro } from '../components/Intro';
import { NewModels } from '../components/NewModels';
import { Categories } from '../components/Categories';
import { HotPrices } from '../components/HotPrices';
import { Container } from '../components/Container';
import { DataState } from '../components/DataState';
import { useGetProductsQuery } from '../store/products/productsApi';

const ERROR_MESSAGE =
  "Couldn't load the catalogue. Check your connection and retry.";

export const HomePage: React.FC = () => {
  // The sliders below read the same cached query, so this doesn't cost an
  // extra request — it just gives the page one loading state instead of
  // three empty carousels appearing one by one.
  const { isLoading, isError, refetch } = useGetProductsQuery();

  return (
    <>
      <Intro />

      {isLoading || isError ? (
        <Container>
          <DataState
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            message={ERROR_MESSAGE}
          />
        </Container>
      ) : (
        <>
          <NewModels />
          <Categories />
          <HotPrices />
        </>
      )}
    </>
  );
};
