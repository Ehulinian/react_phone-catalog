import cn from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import icons from '../../assets/icons/icons.svg';
import { Product } from '../../types/Product';
import styles from './ProductCard.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addToFavorites,
  removeFromFavorites,
} from '../../store/favorites/favoritesSlice';
import { Button } from '../UI/Button';

interface ProductCardProps {
  product: Product;
  showRegularPrice?: boolean;
  imageWrapperSize?: 'small' | 'large';
  classNames?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showRegularPrice,
  imageWrapperSize,
  classNames,
}) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);

  const imageWrapperClass = cn(styles.imageWrapper, {
    [styles.wrapperSmall]: imageWrapperSize === 'small',
    [styles.wrapperLarge]: imageWrapperSize === 'large',
  });

  const isFavorite = favorites.some(favorite => favorite.id === product.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product));
    }
  };

  return (
    <Link
      to={`/${product.category}/${product.itemId}`}
      className={cn(styles.productCard, classNames && styles[classNames])}
    >
      <div className={styles.productDetails}>
        <div className={imageWrapperClass}>
          <img
            src={product?.image}
            alt={product.name}
            className={styles.productImage}
            loading="lazy"
          />
        </div>

        <p className={styles.productName}>{product.name}</p>
        <h3 className={styles.productPriceDiscount}>
          ${product.price}
          {showRegularPrice && (
            <del className={styles.productStrikePrice}>
              ${product.fullPrice}
            </del>
          )}
        </h3>

        <div className={styles.textWrapper}>
          <p className={styles.productCharacteristicsWrapper}>
            Screen
            <span className={styles.characteristics}>{product.screen}</span>
          </p>
          <p className={styles.productCharacteristicsWrapper}>
            Capacity
            <span className={styles.characteristics}>{product.capacity}</span>
          </p>
          <p className={styles.productCharacteristicsWrapper}>
            RAM <span className={styles.characteristics}>{product.ram}</span>
          </p>
        </div>

        <div className={styles.productCardButtons}>
          <Button product={product} />
          <button
            className={cn(styles.addToFavouriteBtn, {
              [styles.active]: isFavorite,
            })}
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              handleToggleFavorite();
            }}
          >
            <svg
              className={cn(styles.icon, {
                [styles.favoriteIcon]: isFavorite,
              })}
            >
              {!isFavorite ? (
                <use href={`${icons}#header-icon-header`}></use>
              ) : (
                <use href={`${icons}#heart-icon`}></use>
              )}
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};
