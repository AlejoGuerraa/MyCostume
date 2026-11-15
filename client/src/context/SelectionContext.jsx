import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { SelectionContext } from './selectionContext.js'

const STORAGE_KEY = 'mycostume:selected-item-ids'

function readStoredSelection() {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue === null) {
      return { ids: [], message: '' }
    }

    const parsedValue = JSON.parse(storedValue)
    if (!Array.isArray(parsedValue)) {
      return { ids: [], message: 'Saved selections were invalid and have been cleared.' }
    }

    const validIds = parsedValue.filter(
      (itemId) => Number.isSafeInteger(itemId) && itemId > 0,
    )
    const uniqueIds = [...new Set(validIds)]
    const containedInvalidValues =
      validIds.length !== parsedValue.length || uniqueIds.length !== parsedValue.length

    return {
      ids: uniqueIds,
      message: containedInvalidValues
        ? 'Invalid or duplicate saved selections were removed.'
        : '',
    }
  } catch {
    return { ids: [], message: 'Saved selections could not be read and were reset.' }
  }
}

export function SelectionProvider({ children }) {
  const [selection, setSelection] = useState(readStoredSelection)
  const selectedItemIds = selection.ids

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItemIds))
    } catch {
      window.setTimeout(() => {
        setSelection((current) => ({
          ...current,
          message: 'Your selection could not be saved in this browser.',
        }))
      }, 0)
    }
  }, [selectedItemIds])

  const addSelectedItem = useCallback((itemId) => {
    if (!Number.isSafeInteger(itemId) || itemId < 1) {
      return
    }

    setSelection((current) => ({
      ids: current.ids.includes(itemId) ? current.ids : [...current.ids, itemId],
      message: '',
    }))
  }, [])

  const removeSelectedItem = useCallback((itemId) => {
    setSelection((current) => ({
      ids: current.ids.filter((selectedId) => selectedId !== itemId),
      message: '',
    }))
  }, [])

  const reconcileSelectedItems = useCallback((availableIds) => {
    const availableIdSet = new Set(availableIds)
    setSelection((current) => {
      const ids = current.ids.filter((itemId) => availableIdSet.has(itemId))
      return ids.length === current.ids.length
        ? current
        : {
            ids,
            message: 'Items no longer in the catalog were removed from your selection.',
          }
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      selectedItemIds,
      storageMessage: selection.message,
      addSelectedItem,
      removeSelectedItem,
      reconcileSelectedItems,
    }),
    [
      addSelectedItem,
      reconcileSelectedItems,
      removeSelectedItem,
      selectedItemIds,
      selection.message,
    ],
  )

  return (
    <SelectionContext.Provider value={contextValue}>{children}</SelectionContext.Provider>
  )
}
