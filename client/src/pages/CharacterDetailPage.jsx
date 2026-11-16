import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CharacterItemList from '../components/CharacterItemList.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import ImageWithFallback from '../components/ImageWithFallback.jsx'
import { useSelection } from '../context/useSelection.js'
import { fetchCostume } from '../services/catalogApi.js'
import './css/CharacterDetailPage.css'

function CharacterDetailPage() {
  const { costumeId } = useParams()
  const { selectedVariants } = useSelection()
  const [detailState, setDetailState] = useState({
    costumeId: null,
    costume: null,
    error: '',
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchCostume(costumeId, { signal: controller.signal })
      .then((costume) => {
        if (!controller.signal.aborted) {
          setDetailState({ costumeId, costume, error: '' })
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setDetailState({ costumeId, costume: null, error: requestError.message })
        }
      })

    return () => controller.abort()
  }, [costumeId])

  const isCurrentDetail = detailState.costumeId === costumeId
  const costume = isCurrentDetail ? detailState.costume : null
  const error = isCurrentDetail ? detailState.error : ''
  const loading = !isCurrentDetail

  return (
    <>
      <Header />
      <main className="page-container character-detail-page">
        <Link className="back-to-catalog" to="/">
          ← Back to catalog
        </Link>

        {loading && (
          <p className="catalog-state" role="status">
            Loading character...
          </p>
        )}
        {!loading && error && (
          <p className="catalog-state is-error" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && costume && (
          <>
            <section className="character-profile" aria-labelledby="character-name">
              <div className="character-profile-image">
                <ImageWithFallback
                  src={costume.urlPhoto}
                  alt={costume.name}
                  className="character-main-image"
                  loading="eager"
                />
              </div>
              <div className="character-profile-copy">
                <p className="section-eyebrow">CHARACTER</p>
                <h1 id="character-name">{costume.name}</h1>
                {costume.description && <p>{costume.description}</p>}
                {costume.source && (
                  <p className="character-source">Reference: {costume.source}</p>
                )}
              </div>
            </section>

            <section className="character-items-section" aria-labelledby="character-items-title">
              <div className="catalog-heading">
                <div>
                  <p className="section-eyebrow">ASSOCIATED ITEMS</p>
                  <h2 id="character-items-title">Items in this look</h2>
                </div>
                <p className="catalog-count">
                  {costume.items.length} {costume.items.length === 1 ? 'ITEM' : 'ITEMS'}
                </p>
              </div>

              <p className="character-items-legend">
                Items outlined in green are already in your selection.
              </p>

              {costume.items.length > 0 ? (
                <CharacterItemList
                  items={costume.items}
                  selectedVariants={selectedVariants}
                />
              ) : (
                <p className="catalog-state" role="status">
                  No items are associated with this character yet.
                </p>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

export default CharacterDetailPage
