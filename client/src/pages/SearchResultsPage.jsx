import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useSelection } from '../context/useSelection.js'
import { useCategories } from '../hooks/useCategories.js'
import { searchItems } from '../services/catalogApi.js'
import './css/SearchResultsPage.css'

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const categoryId = searchParams.get('categoryId') || ''
  const { categories, error: categoriesError } = useCategories()
  const { selectedItemIds, addSelectedItem, removeSelectedItem } = useSelection()
  const requestKey = `${query}\u0000${categoryId}`
  const [searchResult, setSearchResult] = useState({
    key: null,
    items: [],
    error: '',
  })

  useEffect(() => {
    const controller = new AbortController()

    if (!query) {
      return () => controller.abort()
    }

    searchItems(query, { categoryId, signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) {
          setSearchResult({ key: requestKey, items, error: '' })
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setSearchResult({
            key: requestKey,
            items: [],
            error: requestError.message,
          })
        }
      })

    return () => controller.abort()
  }, [categoryId, query, requestKey])

  const hasCurrentResult = searchResult.key === requestKey
  const items = hasCurrentResult ? searchResult.items : []
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

  function toggleItem(itemId) {
    if (selectedItemIds.includes(itemId)) {
      removeSelectedItem(itemId)
    } else {
      addSelectedItem(itemId)
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
                {items.length} {items.length === 1 ? 'MATCH' : 'MATCHES'}
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
          {!loading && !error && query && items.length === 0 && (
            <p className="catalog-state" role="status">
              No items matched this search. Try another name.
            </p>
          )}
          {!loading && !error && items.length > 0 && (
            <div className="product-grid">
              {items.map((item) => (
                <ProductCard
                  item={item}
                  key={item.itemId}
                  selected={selectedItemIds.includes(item.itemId)}
                  onToggle={toggleItem}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default SearchResultsPage
