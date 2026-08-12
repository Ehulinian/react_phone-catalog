import React from 'react';
import styles from './RecommendedProducts.module.scss';
import { RecommendedSlider } from '../RecommendedSlider';
import { Product } from '../../types/Product';

type Props = {
  recommendedProducts: Product[];
};

export const RecommendedProducts: React.FC<Props> = ({
  recommendedProducts,
}) => {
  return (
    <section className={styles.recommendedSection}>
      <div className={styles.recommendedContent}>
        <div className={styles.wrapper}>
          <h2 className={styles.sectionTitle}>You may also like</h2>
        </div>
        <RecommendedSlider recommendedProducts={recommendedProducts} />
      </div>
    </section>
  );
};
