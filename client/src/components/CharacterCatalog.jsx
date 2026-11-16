import CharacterCard from './CharacterCard.jsx'
import { useCostumes } from '../hooks/useCostumes.js'
import './css/CharacterCatalog.css'

function CharacterCatalog() {
  const { costumes, loading, error } = useCostumes()

  return (
    <section className="character-catalog" aria-labelledby="characters-title">
      <div className="catalog-heading">
        <div>
          <p className="section-eyebrow">COSTUME INSPIRATION</p>
          <h2 id="characters-title">Characters</h2>
        </div>
        {!loading && !error && (
          <p className="catalog-count">
            {costumes.length} {costumes.length === 1 ? 'CHARACTER' : 'CHARACTERS'}
          </p>
        )}
      </div>

      {loading && (
        <p className="catalog-state" role="status">
          Loading characters...
        </p>
      )}
      {!loading && error && (
        <p className="catalog-state is-error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && costumes.length === 0 && (
        <p className="catalog-state" role="status">
          No characters are available yet.
        </p>
      )}
      {!loading && !error && costumes.length > 0 && (
        <div className="character-grid">
          {costumes.map((character) => (
            <CharacterCard character={character} key={character.costumeId} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CharacterCatalog
