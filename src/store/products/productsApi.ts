import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, ProductSpecs } from '../../types/Product';
import { API_URL } from '../../config';

// Product data is served by the phone-catalog-backend service (separate
// repo, see its README) instead of static JSON files, so the same server
// can also create Stripe Checkout Sessions without a secret key ever
// touching the frontend bundle.
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/api` }),
  endpoints: builder => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
    }),
    getCategoryProducts: builder.query<ProductSpecs[], string>({
      query: category => `/products/${category}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetCategoryProductsQuery } = productsApi;
