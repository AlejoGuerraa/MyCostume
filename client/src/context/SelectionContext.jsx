import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { SelectionContext } from './selectionContext.js'
import {
  DEFAULT_COLOR,
  addSelectionVariant,
  getSelectedItemIds,
  hasSelectedVariant,
  readStoredSelection,
  reconcileSelections,
  removeSelectionVariant,
} from '../utils/selectionUtils.js'

const STORAGE_KEY = 'mycostume:selected-item-variants'

function readStoredSelectionValue() {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue === null) {
      return { selections: [], message: '' }
    }

    const parsedValue = JSON.parse(storedValue)
    return readStoredSelection(parsedValue)
  } catch {
    return { selections: [], message: 'Saved selections could not be read and were reset.' }
  }
}

export function SelectionProvider({ children }) {
  const [selection, setSelection] = useState(readStoredSelectionValue)
  const selectedVariants = selection.selections
  const selectedItemIds = getSelectedItemIds(selectedVariants)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedVariants))
    } catch {
      window.setTimeout(() => {
        setSelection((current) => ({
          ...current,
          message: 'Your selection could not be saved in this browser.',
        }))
      }, 0)
    }
  }, [selectedVariants])

  const addSelectedItem = useCallback((itemId, color = DEFAULT_COLOR) => {
    if (!Number.isSafeInteger(itemId) || itemId < 1) {
      return
    }

    setSelection((current) => ({
      selections: addSelectionVariant(current.selections, itemId, color),
      message: '',
    }))
  }, [])

  const removeSelectedItem = useCallback((selectionId) => {
    setSelection((current) => ({
      selections: removeSelectionVariant(current.selections, selectionId),
      message: '',
    }))
  }, [])

  const isSelectedForColor = useCallback(
    (itemId, color) => hasSelectedVariant(selectedVariants, itemId, color),
    [selectedVariants],
  )

  const reconcileSelectedItems = useCallback((availableIds) => {
    setSelection((current) => {
      const nextSelections = reconcileSelections(current.selections, availableIds)
      return nextSelections.length === current.selections.length
        ? current
        : {
            selections: nextSelections,
            message: 'Items no longer in the catalog were removed from your selection.',
          }
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      selectedVariants,
      selectedItemIds,
      storageMessage: selection.message,
      addSelectedItem,
      removeSelectedItem,
      isSelectedForColor,
      reconcileSelectedItems,
    }),
    [
      addSelectedItem,
      isSelectedForColor,
      reconcileSelectedItems,
      removeSelectedItem,
      selectedItemIds,
      selectedVariants,
      selection.message,
    ],
  )

  return (
    <SelectionContext.Provider value={contextValue}>{children}</SelectionContext.Provider>
  )
}
