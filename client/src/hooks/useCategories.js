import { useEffect, useState } from 'react'
import { fetchCategories } from '../services/catalogApi.js'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetchCategories({ signal: controller.signal })
      .then(setCategories)
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

  return { categories, loading, error }
}
