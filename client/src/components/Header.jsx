import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelection } from '../context/useSelection.js'
import SelectedItemsPanel from './SelectedItemsPanel.jsx'
import SearchBar from './SearchBar.jsx'
import './css/Header.css'

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M20 7.5a4 4 0 0 1 4 4c0 2.2-1.6 3.2-4 4.7l-8.8 5.3v11h17.6v-11L20 16.2" />
        <path d="M11.2 21.5h17.6M16 26h8" />
      </svg>
    </span>
  )
}

function Header() {
  const [selectionOpen, setSelectionOpen] = useState(false)
  const { selectedVariants } = useSelection()

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="MyCostume home">
          <BrandMark />
          <span>MyCostume</span>
        </Link>

        <div className="header-search">
          <SearchBar />
        </div>

        <div className="selection-popover-anchor">
          <button
            className="selection-toggle"
            type="button"
            aria-expanded={selectionOpen}
            aria-controls="selected-items-panel"
            onClick={() => setSelectionOpen((isOpen) => !isOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 7h14l-1.2 13H6.2L5 7Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span>My items</span>
            <span className="selection-count">{selectedVariants.length}</span>
          </button>
          {selectionOpen && (
            <SelectedItemsPanel onClose={() => setSelectionOpen(false)} />
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
