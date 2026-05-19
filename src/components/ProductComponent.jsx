import { useEffect, useState } from 'react';
import ApiWrapper from './ApiWrapper';

function ProductComponent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/src/assets/products.json');

      if (!response.ok) {
        throw new Error('Failed to fetch products data.');
      }

      const data = await response.json();
      setProducts(data);
    } catch (fetchError) {
      setError(fetchError.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ApiWrapper
      type="products"
      title="Featured Products"
      description="Explore products with dynamic cards, search filtering, and pagination."
      data={products}
      loading={loading}
      error={error}
      onRetry={fetchProducts}
      itemsPerPage={3}
      successMessage="Products loaded successfully!"
    />
  );
}

export default ProductComponent;
