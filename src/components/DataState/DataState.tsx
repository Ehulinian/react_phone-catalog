import React from 'react';
import styles from './DataState.module.scss';
import { Loader } from '../Loader';

type Props = {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  message?: string;
};

export const DataState: React.FC<Props> = ({
  isLoading,
  isError,
  onRetry,
  message = 'Something went wrong while loading this page.',
}) => {
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className={styles.errorState} role="alert">
        <p className={styles.message}>{message}</p>

        {onRetry && (
          <button type="button" className={styles.retry} onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  return null;
};
