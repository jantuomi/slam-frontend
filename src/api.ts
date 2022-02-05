import useSWR, { SWRResponse } from "swr"

const API_URL = import.meta.env.VITE_API_URL

const fetcher = (path: string) => fetch(`${API_URL}${path}`)
  .then(res => res.json())
  .catch((err) => {
    console.error(`An error occurred when fetching API path ${path}`)
    console.error(err)
    throw err
  })

interface Example {
  id: string
  title: string
  content: string
}

export interface APISuccess<D> {
  readonly type: "success"
  data: D
}

export interface APILoading {
  readonly type: "loading"
}

export interface APIFailed<E> {
  readonly type: "failed"
  error: E
}

export interface APINotYetRequested {
  readonly type: "not_yet_requested"
}

export type APIResult<D, E> = APISuccess<D> | APILoading | APIFailed<E> | APINotYetRequested

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

const postRequest = async <D, E>(path: string, body: any, opts?: any): Promise<APIResult<D, E>> => {
  const url = `${API_URL}${path}`
  const body_ = typeof body === "string" ? body : JSON.stringify(body)
  try {
    const resp = await fetch(url, { method: "POST", body: body_, headers: {
      "Content-Type": "application/json",
    }, ...opts })

    if (resp.status >= 400) {
      throw new Error(`${url} responded with ${resp.status}: ${resp.text}`)
    }
    const data = await resp.json()
    return { type: "success", data }
  } catch (err: any) {
    console.error(`An error occurred when POSTing to API path ${path}`)
    console.error(err)
    return { type: "failed", error: err }
  }
}

export const useExamples = () => mapSWRResult<Example[], Error>(
  useSWR("/examples", fetcher),
)

export const submitSource = async (text: string) => postRequest<string, Error>(
  "/submit",
  text,
)
