import { useEffect, useState } from 'react'
import { useSelection } from '../context/useSelection.js'
import { fetchItems } from '../services/catalogApi.js'
import './css/SelectedItemsPanel.css'

function SelectedItemsPanel({ onClose }) {
  const {
    selectedItemIds,
    storageMessage,
    removeSelectedItem,
    reconcileSelectedItems,
  } = useSelection()
  const selectedKey = selectedItemIds.join(',')
  const [itemResult, setItemResult] = useState({
    key: null,
    items: [],
    error: '',
  })

  useEffect(() => {
    if (!selectedKey) {
      return undefined
    }

    const controller = new AbortController()

    fetchItems({
      ids: selectedKey.split(',').map(Number),
      signal: controller.signal,
    })
      .then((results) => {
      if (controller.signal.aborted) {
        return
        }

      setItemResult({ key: selectedKey, items: results, error: '' })
        reconcileSelectedItems(results.map((item) => item.itemId))
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
  }, [reconcileSelectedItems, selectedKey])

  const hasCurrentResult = itemResult.key === selectedKey
  const items = hasCurrentResult ? itemResult.items : []
  const error = hasCurrentResult ? itemResult.error : ''
  const loading = Boolean(selectedKey) && !hasCurrentResult

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
          {items.map((item) => (
            <li key={item.itemId}>
              <div>
                <span className="selected-item-name">{item.name}</span>
                <span className="selected-item-category">{item.category.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeSelectedItem(item.itemId)}
                aria-label={`Remove ${item.name}`}
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
