import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, ProductSpecs } from '../../types/Product';
import styles from './ProductDetails.module.scss';
import icons from '../../assets/icons/icons.svg';
import { Button } from '../UI/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addToFavorites,
  removeFromFavorites,
} from '../../store/favorites/favoritesSlice';
import classNames from 'classnames';
import { colorMapping } from '../../constants/colors';

type Props = {
  productDetails: ProductSpecs;
  product: Product;
  productVariants: ProductSpecs[];
};

// The dataset spells the same color inconsistently across records, e.g. a
// product's own `color` field says "space-gray" while another variant's
// `colorsAvailable` list says "space gray" for the very same color. Comparing
// on lowercase alone (as before) missed this, so picking that swatch found
// no matching variant and silently did nothing. Stripping spaces/hyphens
// makes "space gray", "space-gray" and "spacegray" compare equal.
const normalizeColor = (value: string) =>
  value.toLowerCase().replace(/[\s-]+/g, '');

export const ProductDetails: React.FC<Props> = ({
  productDetails,
  productVariants,
  product,
}) => {
  const [currentVariant, setCurrentVariant] =
    useState<ProductSpecs>(productDetails);
  const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);

  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);

  const navigate = useNavigate();

  // Switching colour or capacity navigates to a different variant of the
  // same product, so the component re-renders — but the user is looking at
  // the selectors partway down the page. Only jump to the top when this is
  // actually a different product (a new namespaceId).
  const previousNamespaceId = useRef<string | null>(null);

  useEffect(() => {
    setCurrentVariant(productDetails);
    setDisplayedImageIndex(0);

    if (previousNamespaceId.current !== productDetails.namespaceId) {
      window.scrollTo({ top: 0 });
    }

    previousNamespaceId.current = productDetails.namespaceId;
  }, [productDetails]);

  const isFavorite = favorites.some(fav => fav.id === product.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product));
    }
  };

  const handleColorChange = (newColor: string) => {
    const matchedVariant = productVariants.find(
      v =>
        normalizeColor(v.color) === normalizeColor(newColor) &&
        v.capacity === currentVariant.capacity &&
        v.namespaceId === currentVariant.namespaceId,
    );

    if (matchedVariant) {
      setCurrentVariant(matchedVariant);
      setDisplayedImageIndex(0);
      navigate(`/${product.category}/${matchedVariant.id}`);
    }
  };

  const handleCapacityChange = (newCapacity: string) => {
    const matchedVariant = productVariants.find(
      v =>
        v.capacity === newCapacity &&
        v.color === currentVariant.color &&
        v.namespaceId === currentVariant.namespaceId,
    );

    if (matchedVariant) {
      setCurrentVariant(matchedVariant);
      setDisplayedImageIndex(0);
      navigate(`/${product.category}/${matchedVariant.id}`);
    }
  };

  const {
    name,
    images,
    priceRegular,
    priceDiscount,
    colorsAvailable,
    capacityAvailable,
    description,
    color,
    ...specs
  } = currentVariant;

  const specsList = [
    { label: 'Screen', value: specs.screen },
    { label: 'Resolution', value: specs.resolution },
    { label: 'Processor', value: specs.processor },
    { label: 'RAM', value: specs.ram },
    { label: 'Built in memory', value: specs.capacity },
    { label: 'Camera', value: specs.camera },
    { label: 'Zoom', value: specs.zoom },
    { label: 'Cell', value: specs.cell.join(', ') },
  ];

  const summaryList = [
    { label: 'Screen', value: specs.screen },
    { label: 'Resolution', value: specs.resolution },
    { label: 'Processor', value: specs.processor },
    { label: 'RAM', value: specs.ram },
  ];

  return (
    <section className={styles.block}>
      <button className={styles.navigationBack} onClick={() => navigate(-1)}>
        <span className={styles.arrowLeft}>
          <svg>
            <use href={`${icons}#arrow-left-icon`}></use>
          </svg>
        </span>
        <span className={styles.back}>Back</span>
      </button>

      <h2 className={styles.title}>{name}</h2>

      <div className={styles.content}>
        <div className={styles.slider}>
          <div className={styles.sliderWrapper}>
            <ul className={styles.imagesList}>
              {images.map((img, index) => (
                <li
                  key={img}
                  className={`${styles.imagesItem} ${index === displayedImageIndex ? styles.active : ''}`}
                >
                  <button
                    type="button"
                    style={{ backgroundImage: `url(${img})` }}
                    className={styles.imagePreview}
                    onClick={() => setDisplayedImageIndex(index)}
                  ></button>
                </li>
              ))}
            </ul>

            <div className={styles.imageWrapper}>
              <img src={images[displayedImageIndex]} alt={name} />
            </div>
          </div>

          <div className={styles.information}>
            <div className={styles.selectors}>
              {colorsAvailable && colorsAvailable.length > 0 && (
                <>
                  <div className={styles.idWrapper}>
                    <p className={styles.selectors__title}>Available colors</p>
                    <div className={styles.idOnTablet}>ID:{product.id}</div>
                  </div>
                  <div className={styles.selectors__options}>
                    {colorsAvailable.map(col => (
                      <div
                        key={col}
                        className={classNames(styles.wrapperColor, {
                          [styles.active]:
                            normalizeColor(col) === normalizeColor(color),
                        })}
                        onClick={() => handleColorChange(col)}
                      >
                        <div
                          className={styles.color}
                          style={{ backgroundColor: colorMapping[col] || col }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {capacityAvailable && capacityAvailable.length > 0 && (
                <div className={styles.selectors}>
                  <p className={styles.selectors__title}>Select capacity</p>
                  <div className={styles.selectors__options}>
                    {capacityAvailable.map(item => (
                      <button
                        key={item}
                        className={classNames(styles.capacity, {
                          [styles.active]: item === specs.capacity,
                        })}
                        onClick={() => handleCapacityChange(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.price}>
              <h2 className={styles.priceCurrent}>${priceDiscount}</h2>
              <del className={styles.priceFull}>${priceRegular}</del>
            </div>

            <div className={styles.productCardButtons}>
              <Button product={product} className={styles.customButton} />
              <button
                className={styles.addToFavouriteBtn}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorite();
                }}
              >
                <svg
                  className={classNames(styles.icon, {
                    [styles.favoriteIcon]: isFavorite,
                  })}
                >
                  {!isFavorite ? (
                    <use href={`${icons}#header-icon-header`} />
                  ) : (
                    <use href={`${icons}#heart-icon`} />
                  )}
                </svg>
              </button>
            </div>

            <div className={styles.specs}>
              <ul className={styles.specsList}>
                {summaryList.map(({ label, value }) => (
                  <li key={label} className={styles.specsList__itemSm}>
                    <p className={styles.specsChar}>{label}</p>
                    <p className={styles.specsProperty}>{value}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.id}>ID:{product.id}</div>
        </div>

        <div className={styles.specsWrapper}>
          <div className={styles.about}>
            <h3 className={styles.titleAbout}>About</h3>
            <ul className={styles.about__list}>
              {description.map((item, idx) => (
                <li key={idx} className={styles.about__item}>
                  <h4>{item.title}</h4>
                  <p className={styles.description}>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.specs}>
            <h3 className={styles.titleAbout}>Tech specs</h3>
            <ul className={styles.specsList}>
              {specsList.map(({ label, value }) => (
                <li key={label} className={styles.specsList__item}>
                  <p className={styles.property}>{label}</p>
                  <p className={styles.mark}>{value}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
