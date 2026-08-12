import React from 'react';
import { useAppSelector } from '../../store/hooks';
import styles from './Cart.module.scss';
import { useNavigate } from 'react-router-dom';
import icons from '../../assets/icons/icons.svg';
import { CartProducts } from '../../types/CartProduct';
import { CartProd } from '../CartProduct';
import { Checkout } from '../UI/Checkout';

const Cart: React.FC = () => {
  const cart = useAppSelector(state => state.cart.items);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={styles.cart}>
      <div className={styles.intro}>
        <button className={styles.navigationHome} onClick={() => navigate('/')}>
          <span className={styles.arrowLeft}>
            <svg>
              <use href={`${icons}#arrow-left-icon`}></use>
            </svg>
          </span>
          Back
        </button>
        <h2 className={styles.cartTitle}>Cart</h2>
      </div>

      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <img
            src={`${process.env.PUBLIC_URL}/img/cart-is-empty.png`}
            alt="Empty"
          />
        </div>
      ) : (
        <div className={styles.cartContent}>
          <ul className={styles.cartList}>
            {cart.map((product: CartProducts) => (
              <CartProd key={product.id} product={product} />
            ))}
          </ul>
          <div className={styles.checkout}>
            <h3> ${totalPrice}</h3>
            <p className={styles.totalFor}>Total for {totalItems} items</p>

            <Checkout cart={cart} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
