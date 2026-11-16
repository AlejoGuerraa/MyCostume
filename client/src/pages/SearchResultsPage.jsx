import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import CharacterCard from '../components/CharacterCard.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useSelection } from '../context/useSelection.js'
import { useCategories } from '../hooks/useCategories.js'
import { searchCatalog } from '../services/catalogApi.js'
import './css/SearchResultsPage.css'

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const categoryId = searchParams.get('categoryId') || ''
  const { categories, error: categoriesError } = useCategories()
  const { addSelectedItem, isSelectedForColor, removeSelectedItem } = useSelection()
  const requestKey = `${query}\u0000${categoryId}`
  const [searchResult, setSearchResult] = useState({
    key: null,
    items: [],
    costumes: [],
    error: '',
  })

  useEffect(() => {
    const controller = new AbortController()

    if (!query) {
      return () => controller.abort()
    }

    searchCatalog(query, { categoryId, signal: controller.signal })
      .then((results) => {
        if (!controller.signal.aborted) {
          setSearchResult({ key: requestKey, ...results, error: '' })
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setSearchResult({
            key: requestKey,
            items: [],
            costumes: [],
            error: requestError.message,
          })
        }
      })

    return () => controller.abort()
  }, [categoryId, query, requestKey])

  const hasCurrentResult = searchResult.key === requestKey
  const items = hasCurrentResult ? searchResult.items : []
  const costumes = hasCurrentResult ? searchResult.costumes : []
  const error = hasCurrentResult ? searchResult.error : ''
  const loading = Boolean(query) && !hasCurrentResult
  function selectCategory(nextCategoryId) {
    const nextParams = new URLSearchParams(searchParams)
    if (nextCategoryId) {
      nextParams.set('categoryId', nextCategoryId)
    } else {
      nextParams.delete('categoryId')
    }

    setSearchParams(nextParams)
  }

  function toggleItem(itemId, color) {
    if (isSelectedForColor(itemId, color)) {
      removeSelectedItem(`item-${itemId}-${color.hex.toLowerCase()}`)
    } else {
      addSelectedItem(itemId, color)
    }
  }

  return (
    <>
      <Header />
      <main className="page-container search-results-page">
        <Link className="back-to-catalog" to="/">
          ← Back to catalog
        </Link>
        <section aria-labelledby="search-results-title">
          <div className="search-results-heading">
            <div>
              <p className="section-eyebrow">CATALOG SEARCH</p>
              <h1 id="search-results-title">
                {query ? `Results for “${query}”` : 'Search the catalog'}
              </h1>
            </div>
            {!loading && !error && query && (
              <p className="search-result-count">
                {items.length + costumes.length}{' '}
                {items.length + costumes.length === 1 ? 'MATCH' : 'MATCHES'}
              </p>
            )}
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategoryId={categoryId}
            onSelect={selectCategory}
          />

          {categoriesError && categoriesError !== error && (
            <p className="catalog-state is-error" role="alert">
              {categoriesError}
            </p>
          )}
          {loading && (
            <p className="catalog-state" role="status">
              Searching the full catalog...
            </p>
          )}
          {!loading && error && (
            <p className="catalog-state is-error" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && !query && (
            <p className="catalog-state" role="status">
              Enter a search term to find catalog items.
            </p>
          )}
          {!loading && !error && query && items.length === 0 && costumes.length === 0 && (
            <p className="catalog-state" role="status">
              No items or characters matched this search. Try another name.
            </p>
          )}
          {!loading && !error && items.length > 0 && (
            <section className="search-result-section" aria-labelledby="item-results-title">
              <div className="search-result-section-heading">
                <h2 id="item-results-title">Items</h2>
                <span>{items.length}</span>
              </div>
              <div className="product-grid">
                {items.map((item) => (
                  <ProductCard
                    item={item}
                    key={item.itemId}
                    isSelectedForColor={isSelectedForColor}
                    onToggle={toggleItem}
                  />
                ))}
              </div>
            </section>
          )}
          {!loading && !error && costumes.length > 0 && (
            <section
              className="search-result-section"
              aria-labelledby="character-results-title"
            >
              <div className="search-result-section-heading">
                <h2 id="character-results-title">Characters</h2>
                <span>{costumes.length}</span>
              </div>
              <div className="character-grid">
                {costumes.map((character) => (
                  <CharacterCard character={character} key={character.costumeId} />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default SearchResultsPage
