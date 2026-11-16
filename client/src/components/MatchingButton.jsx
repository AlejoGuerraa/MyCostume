import { Link, useLocation } from 'react-router-dom'
import './css/MatchingButton.css'

function MatchingButton() {
  const location = useLocation()

  if (location.pathname === '/matches') {
    return null
  }

  return (
    <Link className="matching-button" to="/matches">
      Buscar coincidencias <span aria-hidden="true">→</span>
    </Link>
  )
}

export default MatchingButton
