import { useEffect, useState, useCallback } from 'react'

type RequestOptions = {
  params: Record<string, string>
  manual?: boolean
  onSuccess?: () => void
  onError?: () => void
}

export const useRequest = <Res>(
  requestApi: (params: Record<string, string>) => Promise<Res>,
  options: RequestOptions,
) => {
  const [data, setData] = useState<Res | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const init = useCallback(
    (params: Record<string, string>) => {
      setLoading(true)
      return requestApi(params)
        .then((res) => {
          setData(res)
          if (typeof options.onSuccess === 'function') {
            options.onSuccess()
          }
        })
        .catch((err) => {
          setError(err)
          if (typeof options.onError === 'function') {
            options.onError()
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [requestApi],
  )

  useEffect(() => {
    if (!options.manual) {
      init(options.params)
    }
  }, [init, options.manual, options.params])

  const run = (params: Record<string, string>) => init(params)

  return {
    data,
    loading,
    error,
    run,
  }
}
