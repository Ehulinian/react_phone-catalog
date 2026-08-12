import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './CheckoutResult.module.scss';
import { useAppDispatch } from '../store/hooks';
import { clearCart } from '../store/cart/cartSlice';

export const CheckoutSuccessPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Thank you for your order!</h1>
      <p className={styles.text}>
        Your payment was successful and your cart has been cleared.
      </p>
      <Link to="/" className={styles.link}>
        Back to home
      </Link>
    </div>
  );
};
