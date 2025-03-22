import type { AnalysisResult, AnalyzeResultObject } from "@/types/api"

const API_URL = "https://searchlysis.com/api"
const API_KEY = process.env.SEARCHLYSIS_API_KEY

if (!API_KEY) {
  console.warn("SEARCHLYSIS_API_KEY is not defined")
}

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY || "",
}

export async function analyzeSearch(query: string, prompt: string, temperature = 0.8, group?: string) {
  const metadata = group ? { group } : undefined

  const response = await fetch(`${API_URL}/v1/search`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      prompt,
      temperature,
      metadata,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to analyze search: ${response.statusText}`)
  }

  const data = await response.json()
  return data.results[0] as AnalyzeResultObject
}

export async function analyzeLink(link: string, prompt: string, temperature = 0.8, group?: string) {
  const metadata = group ? { group } : undefined

  const response = await fetch(`${API_URL}/v1/links`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      link,
      prompt,
      temperature,
      metadata,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to analyze link: ${response.statusText}`)
  }

  const data = await response.json()
  return data.results[0] as AnalyzeResultObject
}

export async function getAnalysis(analysisId: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/v1/analyses?analysisId=${analysisId}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to get analysis: ${response.statusText}`)
  }

  return response.json()
}

export async function updateAnalysis(
  analysisId: string,
  content?: string,
  metadata?: Record<string, any>,
): Promise<AnalysisResult> {
  const body: any = { analysisId }

  if (content !== undefined) {
    body.content = content
  }

  if (metadata !== undefined) {
    body.metadata = metadata
  }

  const response = await fetch(`${API_URL}/v1/analyses`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Failed to update analysis: ${response.statusText}`)
  }

  return response.json()
}

export async function listAnalyses(
  pageNum = 1,
  pageSize = 10,
  metadata?: Record<string, any>,
): Promise<AnalysisResult[]> {
  let url = `${API_URL}/v1/analyses/list?pageNum=${pageNum}&pageSize=${pageSize}`

  if (metadata) {
    url += `&metadata=${encodeURIComponent(JSON.stringify(metadata))}`
  }

  const response = await fetch(url, {
    headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to list analyses: ${response.statusText}`)
  }

  return response.json()
}

