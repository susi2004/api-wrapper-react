import { useEffect, useMemo, useState } from 'react';
import ToastContainer, { toast } from './Toast';
import UserCard from './UserCard';
import ProductCard from './ProductCard';
import '../styles/ApiWrapper.css';

const componentMap = {
  users: UserCard,
  products: ProductCard,
};

const searchableFieldMap = {
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
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const CardComponent = componentMap[type];
  const searchField = searchableFieldMap[type] ?? 'name';

  useEffect(() => {
    if (!loading && !error && data.length > 0) {
      toast.success(successMessage);
    }
  }, [data.length, error, loading, successMessage]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((item) => {
      const value = String(item?.[searchField] ?? '').toLowerCase();
      return value.includes(normalizedSearch);
    });
  }, [data, search, searchField]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleRetry = () => {
    toast.retry('Retrying request...');
    onRetry?.();
  };

  if (!CardComponent) {
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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="search-box"
          />
          <button className="retry-button" onClick={handleRetry}>
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

        {!loading && !error && filteredData.length === 0 && (
          <div className="status-box empty-box">
            <p>No matching records found.</p>
          </div>
        )}

        {!loading && !error && filteredData.length > 0 && (
          <>
            <div className="item-grid">
              {paginatedData.map((item) => (
                <CardComponent item={item} key={item.id} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <button onClick={() => setCurrentPage((page) => page - 1)} disabled={currentPage === 1}>
                  Prev
                </button>
                <span>
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((page) => page + 1)}
                  disabled={currentPage === totalPages}
                >
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
