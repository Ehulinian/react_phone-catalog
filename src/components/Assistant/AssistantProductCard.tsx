import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AssistantProductCard.module.scss';
import { Product } from '../../types/Product';
import { Button } from '../UI/Button';

type Props = {
  product: Product;
  onNavigate: () => void;
};

/**
 * Compact result row for the assistant panel. The catalogue's ProductCard is
 * a fixed 272x506 tile built for a grid — six of those inside a chat panel
 * would be several screens of scrolling. This keeps the same actions (open
 * the product, add to cart) in a row that fits the panel.
 */
export const AssistantProductCard: React.FC<Props> = ({
  product,
  onNavigate,
}) => {
  return (
    <article className={styles.card}>
      <Link
        to={`/${product.category}/${product.itemId}`}
        className={styles.imageLink}
        onClick={onNavigate}
      >
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
      </Link>

      <div className={styles.details}>
        <Link
          to={`/${product.category}/${product.itemId}`}
          className={styles.name}
          onClick={onNavigate}
        >
          {product.name}
        </Link>

        <p className={styles.specs}>
          {product.capacity} · {product.ram} · {product.screen}
        </p>

        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price}</span>
          {product.fullPrice > product.price && (
            <del className={styles.fullPrice}>${product.fullPrice}</del>
          )}
        </div>

        <Button product={product} className={styles.cartButton} />
      </div>
    </article>
  );
};
