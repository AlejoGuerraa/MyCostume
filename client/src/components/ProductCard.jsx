import { useState } from 'react'
import { COLOR_PALETTE, DEFAULT_COLOR } from '../utils/colorPalette.js'
import ImageWithFallback from './ImageWithFallback.jsx'
import './css/ProductCard.css'

function ProductCard({ item, isSelectedForColor, onToggle }) {
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR)
  const selected = isSelectedForColor(item.itemId, selectedColor)

  return (
    <article className={`product-card${selected ? ' is-selected' : ''}`}>
      <div className="product-image-wrap">
        <ImageWithFallback
          src={item.urlPhoto}
          alt={item.name}
          className="product-image"
        />

        <label className="color-selector" htmlFor={`color-${item.itemId}`}>
          <span className="color-selector-swatch" aria-hidden="true" style={{ backgroundColor: selectedColor.hex }} />
          <select
            id={`color-${item.itemId}`}
            value={selectedColor.hex}
            aria-label={`Choose a color for ${item.name}`}
            onChange={(event) => {
              const nextColor = COLOR_PALETTE.find((color) => color.hex === event.target.value)
              if (nextColor) {
                setSelectedColor(nextColor)
              }
            }}
          >
            {COLOR_PALETTE.map((color) => (
              <option key={color.hex} value={color.hex}>
                {color.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="product-details">
        <p className="product-category">{item.category.name}</p>
        <h3 className="product-name">{item.name}</h3>

        <button
          className="item-toggle"
          type="button"
          aria-pressed={selected}
          onClick={() => onToggle(item.itemId, selectedColor)}
        >
          {selected ? 'Selected' : 'Add item'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
