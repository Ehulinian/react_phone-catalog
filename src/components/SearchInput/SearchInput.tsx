import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchTerm } from '../../store/search/searchSlice';
import styles from './SearchInput.module.scss';
import icons from '../../assets/icons/icons.svg';

interface Props {
  category: string;
}

export const SearchInput: React.FC<Props> = ({ category }) => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(state => state.search.term);
  const [localValue, setLocalValue] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setLocalValue('');
    dispatch(setSearchTerm(''));
  }, [pathname, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchTerm(localValue.trim()));
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, dispatch]);

  const handleClear = () => {
    setLocalValue('');
  };

  // Expanded whenever the field is focused or already has a value — collapses
  // back to just the icon once it's both empty and blurred.
  const isExpanded = isFocused || Boolean(localValue);

  return (
    <div
      className={cn(styles.searchWrapper, { [styles.expanded]: isExpanded })}
    >
      <svg
        className={cn(styles.iconSearch, {
          [styles.iconHidden]: Boolean(localValue),
        })}
      >
        <use href={`${icons}#search-icon`} />
      </svg>

      <button
        type="button"
        className={cn(styles.clearButton, {
          [styles.iconHidden]: !localValue,
        })}
        onClick={handleClear}
        aria-label="Clear search"
        tabIndex={localValue ? 0 : -1}
      >
        <svg className={styles.iconClear}>
          <use href={`${icons}#icon-clear`} />
        </svg>
      </button>

      <input
        type="text"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`Search in ${category}...`}
        className={styles.headerSearchInput}
      />
    </div>
  );
};
