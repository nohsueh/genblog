"use server";

import type {
  AnalysisResult,
  AnalyzeLinksParams,
  AnalyzeResults,
  AnalyzeSearchParams,
} from "@/types/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = "https://searchlysis.com/api";
const API_KEY = process.env.SEARCHLYSIS_API_KEY;
const SESSION_COOKIE_NAME = "blog_admin_session";
const SESSION_EXPIRY = 60 * 60 * 24; // 24 hours

if (!API_KEY) {
  console.warn("SEARCHLYSIS_API_KEY is not defined");
}

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY || "",
};

export async function validateAdmin(formData: FormData) {
  const password = formData.get("password") as string;

  if (password === process.env.SEARCHLYSIS_BLOG_ADMIN_TOKEN) {
    // Set a secure, HTTP-only cookie for the admin session
    (
      await // Set a secure, HTTP-only cookie for the admin session
      cookies()
    ).set({
      name: SESSION_COOKIE_NAME,
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_EXPIRY,
      path: "/",
    });

    return { success: true };
  }

  return { success: false };
}

export async function checkAdminSession() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME);
  return session?.value === "authenticated";
}

export async function logoutAdmin() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function requireAdmin(lang: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    redirect(`/${lang}/admin`);
  }
}

export async function analyzeSearch(formData: FormData) {
  const query = formData.get("query") as string;
  const prompt = formData.get("prompt") as string;
  const group = formData.get("group") as string;
  const temperatureStr = formData.get("temperature") as string;
  const temperature = Number.parseFloat(temperatureStr);

  const metadata = group ? { group } : undefined;

  const params: AnalyzeSearchParams = {
    query,
    prompt,
    temperature,
    metadata,
  };

  const response = await fetch(`${API_URL}/v1/search`, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to analyze search: ${response.statusText}`);
  }

  const data: AnalyzeResults = await response.json();
  return data;
}

export async function analyzeLinks(formData: FormData) {
  const links = JSON.parse(formData.get("links") as string) as string[];
  const prompt = formData.get("prompt") as string;
  const group = formData.get("group") as string;
  const temperatureStr = formData.get("temperature") as string;
  const temperature = Number.parseFloat(temperatureStr);

  const metadata = group ? { group } : undefined;

  const params: AnalyzeLinksParams = {
    link: links,
    prompt,
    temperature,
    metadata,
  };

  const response = await fetch(`${API_URL}/v1/links`, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to analyze link: ${response.statusText}`);
  }

  const data: AnalyzeResults = await response.json();
  return data;
}

export async function getAnalysis(analysisId: string): Promise<AnalysisResult> {
  const response = await fetch(
    `${API_URL}/v1/analyses?analysisId=${analysisId}`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get analysis: ${response.statusText}`);
  }

  return response.json();
}

export async function updateAnalysis(formData: FormData) {
  const analysisId = formData.get("analysisId") as string;
  const content = formData.get("content") as string;
  const group = formData.get("group") as string;

  // Get the current analysis to preserve existing metadata
  const currentAnalysis = await getAnalysis(analysisId);
  const metadata = {
    ...currentAnalysis.metadata,
    group: group || undefined,
  };

  const body = {
    analysisId,
    content,
    metadata,
  };

  const response = await fetch(`${API_URL}/v1/analyses`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to update analysis: ${response.statusText}`);
  }

  return response.json() as Promise<AnalysisResult>;
}

export async function listAnalyses(
  pageNum = 1,
  pageSize = 10,
  metadata?: Record<string, any>
): Promise<AnalysisResult[]> {
  let url = `${API_URL}/v1/analyses/list?pageNum=${pageNum}&pageSize=${pageSize}`;

  if (metadata) {
    url += `&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to list analyses: ${response.statusText}`);
  }

  return response.json();
}

export async function getPublishedBlogs(
  pageNum = 1,
  pageSize = 20,
  group?: string
): Promise<{ blogs: AnalysisResult[]; total: number }> {
  const metadata = group ? { group } : undefined;

  const allBlogs = await listAnalyses(pageNum, pageSize, metadata);
  const total = await getTotalBlogs(metadata);
  return { blogs: allBlogs, total };
}

async function getTotalBlogs(metadata?: { group?: string }): Promise<number> {
  let url = `${API_URL}/v1/analyses/count`;

  if (metadata) {
    url += `?metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  console.log({ url, metadata, headers });

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error("Failed to fetch total blogs");
  }

  const data = await response.json();
  return data.count;
}
