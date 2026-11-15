import { useContext } from 'react'
import { SelectionContext } from './selectionContext.js'

export function useSelection() {
  const context = useContext(SelectionContext)
  if (context === null) {
    throw new Error('useSelection must be used within a SelectionProvider.')
  }

  return context
}
