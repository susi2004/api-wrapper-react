import React ,{ useState, useEffect } from "react";
import "./ApiWrapper.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ApiWrapper({
  title = "API Data",
  description = "User Component Loads",
  data = [],
  loading = false,
  error = "",
  onRetry,
  renderItem,
  successMessage = "Data loaded successfully!",
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !error && data.length > 0) {
      toast.success(successMessage);
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRetry = () => {
    toast.info("Retrying request...");
    if (onRetry) onRetry();
  };

  return (
    <main className="api-page">
      <section className="api-wrapper-card">
        <div className="api-header">
          <p className="api-eyebrow">Reusable Component</p>
          <h1>{title}</h1>
          <p>{description}</p>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
        </div>

        <button className="retry-button" type="button" onClick={handleRetry}>
          Retry
        </button>

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

        {!loading && !error && data.length === 0 && (
          <div className="status-box empty-box">
            <p>No data found.</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          
          <div className="user-grid">
            {filteredData.map((item) => (
              <article className="user-card" key={item.id}>
                {renderItem(item)}
              </article>
            ))}
          </div>
        )}
      </section>
      <ToastContainer position="top-right" autoClose={1000} />
    </main>
  );
}

export default ApiWrapper;