import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useSelection } from '../context/useSelection.js'
import { useCategories } from '../hooks/useCategories.js'
import { fetchItems } from '../services/catalogApi.js'
import './css/HomePage.css'

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId') || ''
  const { categories, error: categoriesError } = useCategories()
  const { addSelectedItem, isSelectedForColor, removeSelectedItem } = useSelection()
  const [catalogResult, setCatalogResult] = useState({
    categoryId: null,
    items: [],
    error: '',
  })

  useEffect(() => {
    const controller = new AbortController()
    fetchItems({ categoryId, signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) {
          setCatalogResult({ categoryId, items, error: '' })
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setCatalogResult({ categoryId, items: [], error: requestError.message })
        }
      })

    return () => controller.abort()
  }, [categoryId])

  const hasCurrentResult = catalogResult.categoryId === categoryId
  const items = hasCurrentResult ? catalogResult.items : []
  const error = hasCurrentResult ? catalogResult.error : ''
  const loading = !hasCurrentResult

  function selectCategory(nextCategoryId) {
    const nextParams = new URLSearchParams(searchParams)
    if (nextCategoryId) {
      nextParams.set('categoryId', nextCategoryId)
    } else {
      nextParams.delete('categoryId')
    }

    setSearchParams(nextParams, { replace: true })
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
      <main>
        <div className="page-container">
          <section className="hero-panel" aria-labelledby="hero-title">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2000&q=85"
              alt=""
              fetchPriority="high"
            />
            <div className="hero-shade" />
            <div className="hero-copy">
              <p className="hero-eyebrow">MAKE IT YOURS</p>
              <h1 id="hero-title">Your next costume starts here.</h1>
              <p className="hero-description">
                Mix and match clothing, accessories, and props to discover
                characters you can bring to life.
              </p>
            </div>
            <span className="hero-index" aria-hidden="true">
              STYLE YOUR STORY&nbsp; / &nbsp;01
            </span>
          </section>

          <section className="catalog-section" aria-labelledby="catalog-title">
            <div className="catalog-heading">
              <div>
                <p className="section-eyebrow">START WITH WHAT YOU HAVE</p>
                <h2 id="catalog-title">Build your costume kit</h2>
              </div>
              <p className="catalog-count">
                {loading
                  ? 'LOADING ITEMS'
                  : error
                    ? 'CATALOG UNAVAILABLE'
                    : `${items.length} ITEMS`}
              </p>
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
            {error && (
              <p className="catalog-state is-error" role="alert">
                {error}
              </p>
            )}
            {loading && !error && (
              <p className="catalog-state" role="status">
                Loading catalog items...
              </p>
            )}
            {!loading && !error && items.length === 0 && (
              <p className="catalog-state" role="status">
                No items are available in this category yet.
              </p>
            )}
            {!loading && !error && items.length > 0 && (
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
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default HomePage
