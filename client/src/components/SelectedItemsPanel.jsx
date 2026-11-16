import { useEffect, useState } from 'react'
import { useSelection } from '../context/useSelection.js'
import { fetchItems } from '../services/catalogApi.js'
import './css/SelectedItemsPanel.css'

function SelectedItemsPanel({ onClose }) {
  const {
    selectedVariants,
    storageMessage,
    removeSelectedItem,
    reconcileSelectedItems,
  } = useSelection()
  const selectedKey = selectedVariants.map((selection) => selection.selectionId).join(',')
  const [itemResult, setItemResult] = useState({
    key: null,
    items: [],
    error: '',
  })

  useEffect(() => {
    if (selectedVariants.length === 0) {
      return undefined
    }

    const controller = new AbortController()
    const itemIds = [...new Set(selectedVariants.map((selection) => selection.itemId))]

    fetchItems({
      ids: itemIds,
      signal: controller.signal,
    })
      .then((results) => {
        if (controller.signal.aborted) {
          return
        }

        const itemLookup = new Map(results.map((item) => [item.itemId, item]))
        const nextItems = selectedVariants
          .map((selection) => ({
            ...selection,
            item: itemLookup.get(selection.itemId),
          }))
          .filter((selection) => Boolean(selection.item))

        setItemResult({ key: selectedKey, items: nextItems, error: '' })
        reconcileSelectedItems(itemIds)
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setItemResult({
            key: selectedKey,
            items: [],
            error: requestError.message,
          })
        }
      })

    return () => controller.abort()
  }, [reconcileSelectedItems, selectedKey, selectedVariants])

  const hasNoSelections = selectedVariants.length === 0
  const hasCurrentResult = itemResult.key === selectedKey
  const items = hasNoSelections ? [] : hasCurrentResult ? itemResult.items : []
  const error = hasNoSelections ? '' : hasCurrentResult ? itemResult.error : ''
  const loading = !hasNoSelections && !hasCurrentResult

  return (
    <section
      className="selection-panel"
      id="selected-items-panel"
      aria-labelledby="selection-title"
    >
      <div className="selection-panel-heading">
        <div>
          <p className="selection-eyebrow">YOUR COSTUME KIT</p>
          <h2 id="selection-title">Selected items</h2>
        </div>
        <button
          className="selection-close"
          type="button"
          onClick={onClose}
          aria-label="Close selected items"
        >
          ×
        </button>
      </div>

      {storageMessage && (
        <p className="selection-message" role="status">
          {storageMessage}
        </p>
      )}
      {loading && <p className="selection-status">Loading selected items...</p>}
      {!loading && error && (
        <p className="selection-status is-error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="selection-status">Your selection is empty. Add items from the catalog.</p>
      )}
      {!loading && !error && items.length > 0 && (
        <ul className="selected-item-list">
          {items.map((selection) => (
            <li key={selection.selectionId}>
              <div className="selected-item-main">
                <span
                  className="selected-item-swatch"
                  style={{ backgroundColor: selection.color.hex }}
                  aria-hidden="true"
                />
                <div>
                  <span className="selected-item-name">{selection.item.name}</span>
                  <span className="selected-item-category">
                    {selection.color.name} · {selection.item.category.name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeSelectedItem(selection.selectionId)}
                aria-label={`Remove ${selection.item.name} in ${selection.color.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default SelectedItemsPanel
