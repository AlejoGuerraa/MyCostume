import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import MatchResultCard from '../components/MatchResultCard.jsx'
import { useSelection } from '../context/useSelection.js'
import { fetchCostumeMatches } from '../services/catalogApi.js'
import './css/MatchingResultsPage.css'

function MatchingResultsPage() {
  const { selectedItemIds, selectedVariants } = useSelection()
  const selectionKey = [...selectedItemIds].sort((first, second) => first - second).join(',')
  const [result, setResult] = useState({
    selectionKey: null,
    matches: [],
    error: '',
  })

  useEffect(() => {
    if (!selectionKey) {
      return undefined
    }

    const controller = new AbortController()
    const itemIds = selectionKey.split(',').map(Number)

    fetchCostumeMatches(itemIds, { signal: controller.signal })
      .then((matches) => {
        if (!controller.signal.aborted) {
          setResult({ selectionKey, matches, error: '' })
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setResult({ selectionKey, matches: [], error: requestError.message })
        }
      })

    return () => controller.abort()
  }, [selectionKey])

  const isCurrentResult = result.selectionKey === selectionKey
  const matches = isCurrentResult ? result.matches : []
  const error = isCurrentResult ? result.error : ''
  const loading = Boolean(selectionKey) && !isCurrentResult

  return (
    <>
      <Header />
      <main className="page-container matching-results-page">
        <Link className="back-to-catalog" to="/">
          ← Back to catalog
        </Link>
        <section aria-labelledby="matching-title">
          <div className="matching-heading">
            <div>
              <p className="section-eyebrow">YOUR COSTUME MATCHES</p>
              <h1 id="matching-title">Characters for your items</h1>
              <p className="matching-intro">
                Matches are based only on the items associated with each character.
              </p>
            </div>
            {selectionKey && !loading && !error && (
              <p className="catalog-count">
                {matches.length} {matches.length === 1 ? 'MATCH' : 'MATCHES'}
              </p>
            )}
          </div>

          {!selectionKey && (
            <div className="matching-empty-state" role="status">
              <h2>Add items to find character matches</h2>
              <p>
                Select at least one catalog item. We will compare your selection
                with the items associated with each character.
              </p>
              <Link className="matching-empty-link" to="/">
                Browse items
              </Link>
            </div>
          )}
          {loading && (
            <p className="catalog-state" role="status">
              Finding character matches...
            </p>
          )}
          {!loading && error && (
            <p className="catalog-state is-error" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && selectionKey && matches.length === 0 && (
            <div className="matching-empty-state" role="status">
              <h2>No character matches yet</h2>
              <p>
                None of your selected items are currently associated with a
                character. Try adding different items from the catalog.
              </p>
              <Link className="matching-empty-link" to="/">
                Browse items
              </Link>
            </div>
          )}
          {!loading && !error && matches.length > 0 && (
            <div className="matching-grid">
              {matches.map((match) => (
                <MatchResultCard
                  match={match}
                  key={match.costume.costumeId}
                  selectedVariants={selectedVariants}
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

export default MatchingResultsPage
