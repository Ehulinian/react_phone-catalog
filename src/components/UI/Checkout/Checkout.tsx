import { useState } from 'react';
import styles from './Checkout.module.scss';
import { CartProducts } from '../../../types/CartProduct';
import { API_URL } from '../../../config';

type Props = {
  cart: CartProducts[];
};

// Everything before the `#`, without a trailing slash — e.g.
// "https://user.github.io/react_phone-catalog" or "http://localhost:3000".
// `window.location.origin` alone is not enough: on GitHub Pages the app is
// served from a subpath, so Stripe would redirect back to the domain root
// (a 404) instead of the app. Deriving it from the current URL also avoids
// depending on PUBLIC_URL, which is just "." with this project's `homepage`.
const getFrontendBaseUrl = () =>
  window.location.href.split('#')[0].replace(/\/+$/, '');

export const Checkout: React.FC<Props> = ({ cart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    const baseUrl = getFrontendBaseUrl();

    try {
      const response = await fetch(`${API_URL}/api/checkout/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontendOrigin: baseUrl,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: `${baseUrl}/${item.image}`,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout request failed');
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error('Stripe did not return a checkout URL');
      }

      window.location.href = url;
    } catch {
      setError('Could not start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className={styles.checkoutButton}
        onClick={handleCheckout}
        disabled={isLoading || cart.length === 0}
      >
        {isLoading ? 'Redirecting to Stripe...' : 'Checkout'}
      </button>

      {error && <p className={styles.checkoutError}>{error}</p>}
    </>
  );
};
