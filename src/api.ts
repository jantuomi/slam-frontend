import useSWR, { SWRResponse } from "swr"
import { RunnerApi, ExampleApi } from "slam-types"
import { useState } from "react"

const RUNNER_API_URL = String(import.meta.env.VITE_RUNNER_API_URL)
const EXAMPLE_API_URL = String(import.meta.env.VITE_EXAMPLE_API_URL)

const fetcher = (baseUrl: string) => (path: string) => fetch(`${baseUrl}${path}`)
  .then(res => res.json())
  .catch((err) => {
    console.error(`An error occurred when fetching API path ${path}`)
    console.error(err)
    throw err
  })

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

interface BasePostRequest<R> {
  baseUrl: string
  path: string
  body: R
}

const postRequest = async <R, D, E>({ baseUrl, path, body }: BasePostRequest<R>, opts?: any): Promise<APIResult<D, E>> => {
  const url = `${baseUrl}${path}`
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

export const useExamples = () => mapSWRResult<ExampleApi.ListResponse.Body, Error>(
  useSWR(ExampleApi.ListRequest.path, fetcher(EXAMPLE_API_URL)),
)

export type SubmitResult = APIResult<RunnerApi.SubmitResponse.Body & { roundtripTime: number }, Error>

export const useSubmitSource = () => {
  const [result, setResult] = useState<SubmitResult>({ type: "not_yet_requested" })

  const submitSource = async (text: string) => {
    try {
      const startRoundtripTime = performance.now()
      setResult({ type: "loading" })
      const apiResult = await postRequest<RunnerApi.SubmitRequest.Body, RunnerApi.SubmitResponse.Body, Error>(
        {
          baseUrl: RUNNER_API_URL,
          path: RunnerApi.SubmitRequest.path,
          body: {
            source: text,
          },
        },
      )
      const endRoundtripTime = performance.now()
      const roundtripTime = endRoundtripTime - startRoundtripTime
      switch (apiResult.type) {
        case "success":
          setResult({ type: "success", data: { ...apiResult.data, roundtripTime }})
          break

        case "failed":
          setResult({ type: "failed", error: apiResult.error })
          break
        default:
          break
      }
    } catch (err: any) {
      setResult({ type: "failed", error: err })
    }
  }

  return { result, submitSource }
}