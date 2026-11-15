import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelection } from '../context/useSelection.js'
import { searchItems } from '../services/catalogApi.js'
import './css/SearchBar.css'

function SearchBar() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') || '')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchResult, setSearchResult] = useState({
    key: null,
    suggestions: [],
    error: '',
  })
  const navigate = useNavigate()
  const { addSelectedItem } = useSelection()
  const categoryId = searchParams.get('categoryId') || ''
  const normalizedQuery = query.trim()
  const requestKey = `${normalizedQuery}\u0000${categoryId}`

  useEffect(() => {
    if (!normalizedQuery) {
      return undefined
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      try {
        const results = await searchItems(normalizedQuery, {
          categoryId,
          limit: 8,
          signal: controller.signal,
        })
        if (!controller.signal.aborted) {
          setSearchResult({ key: requestKey, suggestions: results, error: '' })
        }
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setSearchResult({
            key: requestKey,
            suggestions: [],
            error: requestError.message,
          })
        }
      }
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [categoryId, normalizedQuery, requestKey])

  const hasCurrentResult = searchResult.key === requestKey
  const suggestions = hasCurrentResult ? searchResult.suggestions : []
  const error = hasCurrentResult ? searchResult.error : ''
  const loading = Boolean(normalizedQuery) && !hasCurrentResult
  function submitSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (normalizedQuery) {
      params.set('q', normalizedQuery)
    }
    if (categoryId) {
      params.set('categoryId', categoryId)
    }

    setShowSuggestions(false)
    navigate(`/search${params.size > 0 ? `?${params}` : ''}`)
  }

  function selectSuggestion(item) {
    addSelectedItem(item.itemId)
    setShowSuggestions(false)
  }

  const hasSuggestionPanel =
    showSuggestions && normalizedQuery.length > 0

  return (
    <div className="search-container">
      <form className="search-field" role="search" onSubmit={submitSearch}>
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
          aria-autocomplete="list"
          aria-expanded={hasSuggestionPanel}
          aria-controls="search-suggestions"
          placeholder="Search clothing, accessories, and more..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        <button className="search-submit" type="submit" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>

      {hasSuggestionPanel && (
        <div id="search-suggestions" className="search-suggestions">
          {loading && <p className="search-status">Searching items...</p>}
          {!loading && error && (
            <p className="search-status is-error" role="status">
              {error}
            </p>
          )}
          {!loading && !error && suggestions.length === 0 && (
            <p className="search-status" role="status">
              No matching items found.
            </p>
          )}
          {!loading && !error && suggestions.length > 0 && (
            <ul role="listbox">
              {suggestions.map((item) => (
                <li key={item.itemId}>
                  <button
                    type="button"
                    role="option"
                    aria-label={`Select ${item.name}, ${item.category.name}`}
                    onClick={() => selectSuggestion(item)}
                  >
                    <span>{item.name}</span>
                    <span className="suggestion-category">{item.category.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
