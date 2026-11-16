import CharacterCard from './CharacterCard.jsx'
import CharacterItemList from './CharacterItemList.jsx'
import './css/MatchResultCard.css'

function MatchResultCard({ match, selectedVariants }) {
  return (
    <article className="match-result-card">
      <CharacterCard character={match.costume} />
      <div className="match-result-summary">
        <div className="match-result-count">
          <strong>
            {match.matchedItems} / {match.totalItems} items
          </strong>
          <span>{match.matchPercentage}% match</span>
        </div>
        <progress
          className="match-progress"
          value={match.matchPercentage}
          max="100"
          aria-label={`${match.matchPercentage}% match`}
        />
        <p>
          {match.missingItems} {match.missingItems === 1 ? 'item' : 'items'} missing
        </p>
      </div>
      {match.items.length > 0 && (
        <CharacterItemList
          items={match.items}
          selectedVariants={selectedVariants}
        />
      )}
    </article>
  )
}

export default MatchResultCard
