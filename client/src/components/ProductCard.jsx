import './css/ProductCard.css'

function ProductCard({ item }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          width="800"
          height="800"
        />
      </div>
      <div className="product-details">
        <p className="product-category">{item.category}</p>
        <h3 className="product-name">{item.name}</h3>
        <p className="product-description">{item.description}</p>
      </div>
    </article>
  )
}

export default ProductCard
