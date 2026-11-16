import ImageWithFallback from './ImageWithFallback.jsx'
import './css/CharacterItemList.css'

function CharacterItemList({ items, selectedVariants }) {
  const selectionsByItem = new Map()
  for (const selection of selectedVariants) {
    const variants = selectionsByItem.get(selection.itemId) || []
    variants.push(selection.color)
    selectionsByItem.set(selection.itemId, variants)
  }

  return (
    <ul className="character-item-list">
      {items.map((item) => {
        const selectedColors = selectionsByItem.get(item.itemId) || []
        const isOwned = selectedColors.length > 0

        return (
          <li
            className={`character-item${isOwned ? ' is-owned' : ''}`}
            key={item.itemId}
            aria-label={`${item.name}${isOwned ? ', already in your items' : ''}`}
          >
            <span className="character-item-image">
              <ImageWithFallback src={item.urlPhoto} alt={item.name} />
            </span>
            <span className="character-item-name">{item.name}</span>
            {isOwned && (
              <span className="character-item-owned">
                <span>In your items</span>
                <span className="character-item-colors" aria-label="Selected colors">
                  {selectedColors.map((color) => (
                    <span className="character-item-color" key={color.hex}>
                      <span
                        className="character-item-color-swatch"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      {color.name}
                    </span>
                  ))}
                </span>
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default CharacterItemList
