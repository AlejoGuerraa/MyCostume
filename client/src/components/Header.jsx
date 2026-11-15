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
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <BrandMark />
          <span>MyCostume</span>
        </div>

        <label className="search-field">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="10.8" cy="10.8" r="6.3" />
            <path d="m15.4 15.4 4.1 4.1" />
          </svg>
          <input
            type="search"
            aria-label="Search clothing, accessories, and more"
            placeholder="Search clothing, accessories, and more..."
            readOnly
          />
          <span className="search-shortcut" aria-hidden="true">
            /
          </span>
        </label>
      </div>
    </header>
  )
}

export default Header
