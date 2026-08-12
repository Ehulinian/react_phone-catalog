import React from 'react';
import styles from './Pagination.module.scss';
import icons from '../../../assets/icons/icons.svg';

type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | 'dots-left' | 'dots-right';

// On mobile there simply isn't room to lay out every page number in a row —
// that's what was getting visually cut off. Instead of a wide, horizontally
// scrolling strip (with no visible hint that it *is* scrollable), show a
// compact windowed range with "…" for the gaps: first page, last page, and a
// small neighborhood around the current page. This fits any screen width
// without hiding anything.
function getPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PageItem[] {
  const totalVisible = siblingCount * 2 + 5;

  if (totalVisible >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

    return [...leftRange, 'dots-right', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + siblingCount * 2;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i,
    );

    return [1, 'dots-left', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  );

  return [1, 'dots-left', ...middleRange, 'dots-right', totalPages];
}

export const Pagination: React.FC<Props> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const pageItems = React.useMemo(
    () => getPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.arrowButtons}>
        <button
          className={`${styles.arrowButton} ${
            currentPage === 1 ? styles.disabled : ''
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <svg className={styles.icon}>
            <use href={`${icons}#arrow-left-icon`}></use>
          </svg>
        </button>
      </div>

      <div className={styles.pageNumbers}>
        {pageItems.map(item =>
          typeof item === 'number' ? (
            <button
              key={item}
              className={`${styles.pageButton} ${
                currentPage === item ? styles.active : ''
              }`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ) : (
            <span key={item} className={styles.dots} aria-hidden="true">
              &hellip;
            </span>
          ),
        )}
      </div>

      <div className={styles.arrowButtons}>
        <button
          className={`${styles.arrowButton} ${
            currentPage === totalPages ? styles.disabled : ''
          }`}
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          aria-label="Next Page"
        >
          <svg className={styles.icon}>
            <use href={`${icons}#arrow-right-icon`}></use>
          </svg>
        </button>
      </div>
    </div>
  );
};
