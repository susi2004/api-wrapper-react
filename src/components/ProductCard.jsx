import '../styles/ProductCard.css';

function ProductCard({ item }) {
  return (
    <article className="product-card">
      <img src={item.image} alt={item.title} className="product-image" />
      <div className="product-content">
        <h3>{item.title}</h3>
        <p className="price">${item.price.toFixed(2)}</p>
        <button type="button">Buy Now</button>
      </div>
    </article>
  );
}

export default ProductCard;
