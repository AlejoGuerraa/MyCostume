import { useEffect, useState } from 'react'
import { fetchCostumes } from '../services/catalogApi.js'

export function useCostumes() {
  const [costumes, setCostumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetchCostumes({ signal: controller.signal })
      .then(setCostumes)
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(requestError.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  return { costumes, loading, error }
}
