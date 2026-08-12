import { Link } from 'react-router-dom';
import styles from './CheckoutResult.module.scss';

export const CheckoutCancelPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Checkout cancelled</h1>
      <p className={styles.text}>
        No payment was made. Your cart is still saved.
      </p>
      <Link to="/cart" className={styles.link}>
        Back to cart
      </Link>
    </div>
  );
};
