import useSWR, { SWRResponse } from "swr"

const API_URL = import.meta.env.VITE_API_URL

const fetcher = (path: string) => fetch(`${API_URL}${path}`)
  .then(res => res.json())
  .catch((err) => {
    console.error(`An error occurred when fetching API path ${path}`)
    console.error(err)
    throw err
  })

interface Snippet {
  id: string
  title: string
  content: string
}

interface APISuccess<D> {
  readonly type: "success"
  data: D
}

interface APILoading {
  readonly type: "loading"
}

interface APIFailed<E> {
  readonly type: "failed"
  error: E
}

type APIResult<D, E> = APISuccess<D> | APILoading | APIFailed<E>

const mapSWRResult = <D, E>({ data, error }: SWRResponse<D, E>): APIResult<D, E> => {
  if (error !== undefined) {
    return { type: "failed", error }
  }

  const isLoading = data === undefined
  if (isLoading) {
    return { type: "loading" }
  }

  return { type: "success", data }
}

export const useSnippets = () => mapSWRResult<Snippet[], Error>(
  useSWR("/snippets", fetcher),
)
