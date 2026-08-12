import { Outlet } from 'react-router-dom';
import './App.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { useGetProductsQuery } from './store/products/productsApi';

export const App = () => {
  const { isLoading, isError } = useGetProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="loadErrorMessage">
        Something went wrong while loading the catalog. Please refresh the page
        or try again later.
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
