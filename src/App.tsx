import { Outlet } from 'react-router-dom';
import './App.scss';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useScrollToTop } from './hooks/useScrollToTop';

// The shell renders immediately. Loading and error states belong to the
// pages that actually need catalogue data — blocking everything here made
// /cart and /favorites wait on a fetch they don't depend on, since their
// data comes from localStorage.
export const App = () => {
  useScrollToTop();

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
