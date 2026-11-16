import { Link } from 'react-router-dom'
import ImageWithFallback from './ImageWithFallback.jsx'
import './css/CharacterCard.css'

function CharacterCard({ character }) {
  return (
    <Link
      className="character-card"
      to={`/characters/${character.costumeId}`}
      aria-label={`View character: ${character.name}`}
    >
      <span className="character-card-image">
        <ImageWithFallback
          src={character.urlPhoto}
          alt={character.name}
          className="character-image"
        />
      </span>
      <span className="character-card-details">
        <span className="character-card-name">{character.name}</span>
        <span className="character-card-open">
          View character
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h13M12 5l7 7-7 7" />
          </svg>
        </span>
      </span>
    </Link>
  )
}

export default CharacterCard
