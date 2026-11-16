import { COLOR_PALETTE, DEFAULT_COLOR } from './colorPalette.js'

export { COLOR_PALETTE, DEFAULT_COLOR }

export function normalizeColor(color) {
  if (!color) {
    return { ...DEFAULT_COLOR }
  }

  if (typeof color === 'string') {
    const match = COLOR_PALETTE.find(
      (entry) =>
        entry.name.toLowerCase() === color.toLowerCase() ||
        entry.hex.toLowerCase() === color.toLowerCase(),
    )

    return match ? { ...match } : { ...DEFAULT_COLOR }
  }

  const candidateHex = typeof color.hex === 'string' ? color.hex.trim() : ''
  const candidateName = typeof color.name === 'string' ? color.name.trim() : ''

  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(candidateHex)) {
    const match = COLOR_PALETTE.find(
      (entry) => entry.hex.toLowerCase() === candidateHex.toLowerCase(),
    )

    return {
      name: match ? match.name : candidateName || DEFAULT_COLOR.name,
      hex: candidateHex.toLowerCase(),
    }
  }

  const match = COLOR_PALETTE.find(
    (entry) => entry.name.toLowerCase() === candidateName.toLowerCase(),
  )

  return match ? { ...match } : { ...DEFAULT_COLOR }
}

export function createSelectionId(itemId, color) {
  const normalizedItemId = Number(itemId)
  if (!Number.isSafeInteger(normalizedItemId) || normalizedItemId < 1) {
    return null
  }

  const normalizedColor = normalizeColor(color)
  return `item-${normalizedItemId}-${normalizedColor.hex.toLowerCase()}`
}

export function createSelection(itemId, color) {
  const normalizedItemId = Number(itemId)
  if (!Number.isSafeInteger(normalizedItemId) || normalizedItemId < 1) {
    return null
  }

  const normalizedColor = normalizeColor(color)
  return {
    selectionId: `item-${normalizedItemId}-${normalizedColor.hex.toLowerCase()}`,
    itemId: normalizedItemId,
    color: normalizedColor,
  }
}

export function addSelectionVariant(selections, itemId, color) {
  const selection = createSelection(itemId, color)

  if (!selection) {
    return selections
  }

  return selections.some((entry) => entry.selectionId === selection.selectionId)
    ? selections
    : [...selections, selection]
}

export function removeSelectionVariant(selections, selectionId) {
  if (!selectionId) {
    return selections
  }

  return selections.filter((selection) => selection.selectionId !== selectionId)
}

export function getSelectedItemIds(selections) {
  return [...new Set(selections.map((selection) => selection.itemId))]
}

export function hasSelectedVariant(selections, itemId, color) {
  const selectionId = createSelectionId(itemId, color)
  return Boolean(
    selectionId && selections.some((selection) => selection.selectionId === selectionId),
  )
}

export function reconcileSelections(selections, availableItemIds) {
  if (!Array.isArray(availableItemIds)) {
    return selections
  }

  const validItemIds = new Set(
    availableItemIds.filter((candidate) => Number.isSafeInteger(candidate) && candidate > 0),
  )

  return selections.filter((selection) => validItemIds.has(selection.itemId))
}

export function readStoredSelection(rawValue) {
  if (rawValue === null || rawValue === undefined) {
    return { selections: [], message: '' }
  }

  if (!Array.isArray(rawValue)) {
    return {
      selections: [],
      message: 'Saved selections were invalid and have been cleared.',
    }
  }

  const seenIds = new Set()
  const selections = []
  let migratedLegacy = false
  let droppedValues = 0

  for (const value of rawValue) {
    if (Number.isSafeInteger(value) && value > 0) {
      migratedLegacy = true
      const legacySelection = createSelection(value, DEFAULT_COLOR)
      if (!legacySelection) {
        droppedValues += 1
        continue
      }

      if (!seenIds.has(legacySelection.selectionId)) {
        seenIds.add(legacySelection.selectionId)
        selections.push(legacySelection)
      }
      continue
    }

    if (!value || typeof value !== 'object') {
      droppedValues += 1
      continue
    }

    const itemId = Number(value.itemId ?? value.item_id ?? value.item ?? value.id)
    const candidateColor = value.color ?? value.colour ?? {
      name: value.colorName ?? value.color_name ?? DEFAULT_COLOR.name,
      hex: value.hex ?? value.colorHex ?? value.color_hex ?? DEFAULT_COLOR.hex,
    }

    if (!Number.isSafeInteger(itemId) || itemId < 1) {
      droppedValues += 1
      continue
    }

    const normalizedColor = normalizeColor(candidateColor)
    const selection = createSelection(itemId, normalizedColor)

    if (!selection) {
      droppedValues += 1
      continue
    }

    if (seenIds.has(selection.selectionId)) {
      droppedValues += 1
      continue
    }

    seenIds.add(selection.selectionId)
    selections.push(selection)
  }

  const messages = []

  if (migratedLegacy) {
    messages.push('Legacy saved selections were migrated to the current variant format.')
  }

  if (droppedValues > 0) {
    messages.push('Invalid saved entries were removed.')
  }

  return {
    selections,
    message: messages.join(' '),
  }
}
