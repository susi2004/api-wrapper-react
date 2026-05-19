import { useEffect, useMemo, useState } from 'react';
import ToastContainer, { toast } from './Toast';
import UserCard from './UserCard';
import ProductCard from './ProductCard';
import '../styles/ApiWrapper.css';

const cardByType = {
  users: UserCard,
  products: ProductCard,
};

const searchFieldByType = {
  users: 'name',
  products: 'title',
};

function ApiWrapper({
  type,
  title,
  description,
  data = [],
  loading = false,
  error = '',
  onRetry,
  successMessage = 'Data loaded successfully!',
  itemsPerPage = 4,
}) {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  const Card = cardByType[type];
  const searchField = searchFieldByType[type] || 'name';

  useEffect(() => {
    if (!loading && !error && data.length > 0) {
      toast.success(successMessage);
    }
  }, [loading, error, data.length, successMessage]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  const filteredItems = useMemo(() => {
    const value = searchText.trim().toLowerCase();

    if (!value) {
      return data;
    }

    return data.filter((item) => String(item?.[searchField] || '').toLowerCase().includes(value));
  }, [data, searchField, searchText]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const start = (page - 1) * itemsPerPage;
  const visibleItems = filteredItems.slice(start, start + itemsPerPage);

  const onRetryClick = () => {
    toast.retry('Retrying request...');
    onRetry?.();
  };

  if (!Card) {
    return (
      <main className="api-page">
        <section className="api-wrapper-card">
          <div className="status-box error-box">
            <p>Unsupported component type: {type}</p>
          </div>
        </section>
        <ToastContainer position="top-right" autoClose={1600} />
      </main>
    );
  }

  return (
    <main className="api-page">
      <section className="api-wrapper-card">
        <header className="api-header">
          <p className="api-eyebrow">Reusable API Wrapper</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>

        <div className="toolbar">
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="search-box"
          />
          <button className="retry-button" onClick={onRetryClick}>
            Retry
          </button>
        </div>

        {loading && (
          <div className="status-box">
            <div className="spinner" />
            <p>Loading data...</p>
          </div>
        )}

        {!loading && error && (
          <div className="status-box error-box">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="status-box empty-box">
            <p>No matching records found.</p>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <>
            <div className="item-grid">
              {visibleItems.map((item) => (
                <Card item={item} key={item.id} />
              ))}
            </div>

            {pageCount > 1 && (
              <div className="pagination-controls">
                <button onClick={() => setPage((oldPage) => oldPage - 1)} disabled={page === 1}>
                  Prev
                </button>
                <span>
                  Page {page} / {pageCount}
                </span>
                <button onClick={() => setPage((oldPage) => oldPage + 1)} disabled={page === pageCount}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <ToastContainer position="top-right" autoClose={1600} />
    </main>
  );
}

export default ApiWrapper;
