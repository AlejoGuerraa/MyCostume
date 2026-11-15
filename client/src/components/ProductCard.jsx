import './css/ProductCard.css'

function ItemImagePlaceholder({ itemName }) {
  return (
    <div
      className="item-image-placeholder"
      role="img"
      aria-label={`No image available for ${itemName}`}
    >
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 7a4 4 0 0 1 4 4c0 2.2-1.6 3.2-4 4.7l-12 7.2v16.6h24V22.9l-12-7.2" />
        <path d="M12 23h24M19 29h10" />
      </svg>
      <span>Image coming soon</span>
    </div>
  )
}

function ProductCard({ item, selected, onToggle }) {
  return (
    <article className={`product-card${selected ? ' is-selected' : ''}`}>
      <div className="product-image-wrap">
        {item.urlPhoto ? (
          <img
            className="product-image"
            src={item.urlPhoto}
            alt={item.name}
            loading="lazy"
            width="400"
            height="400"
          />
        ) : (
          <ItemImagePlaceholder itemName={item.name} />
        )}
      </div>
      <div className="product-details">
        <p className="product-category">{item.category.name}</p>
        <h3 className="product-name">{item.name}</h3>
        <button
          className="item-toggle"
          type="button"
          aria-pressed={selected}
          onClick={() => onToggle(item.itemId)}
        >
          {selected ? 'Remove item' : 'Add item'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
