import styles from './Button.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addToCart, removeFromCart } from '../../../store/cart/cartSlice';
import { CartProducts } from '../../../types/CartProduct';
import { Product } from '../../../types/Product';

interface ButtonProps {
  product: Product;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ product, className }) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart.items);
  const isInCart = cart.some(item => item.id === product.id);

  const handleCartAction = () => {
    if (isInCart) {
      dispatch(removeFromCart(product.id));
    } else {
      const cartProduct: CartProducts = {
        ...product,
        quantity: 1,
      };

      dispatch(addToCart(cartProduct));
    }
  };

  return (
    <button
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        handleCartAction();
      }}
      className={`${isInCart ? styles.addedToCartBtn : styles.addToCartBtn} ${className || ''}`}
    >
      {isInCart ? 'Added to cart' : 'Add to cart'}
    </button>
  );
};
