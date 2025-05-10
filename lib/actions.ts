"use server";

import type {
  AnalysisResult,
  AnalyzeLinksParams,
  AnalyzeResults,
  AnalyzeSearchParams,
} from "@/types/api";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBaseUrl } from "./utils";

const API_URL = "https://searchlysis.com/api";
const ROLE = "admin";
const API_KEY = process.env.SEARCHLYSIS_API_KEY;
const ADMIN_TOKEN = process.env.PASSWORD;
const COOKIE_NAME = `__Secure-${btoa(new URL(getBaseUrl()).pathname)}`;
const COOKIE_EXPIRY = 60 * 60 * 24 * 7; // 7 days

if (!API_KEY) {
  throw new Error("SEARCHLYSIS_API_KEY is not defined");
}

if (!ADMIN_TOKEN) {
  throw new Error("PASSWORD is not defined");
}

interface JWTPayload {
  role: string;
  iat: number;
  exp: number;
}

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

export async function validateAdmin(formData: FormData) {
  const password = formData.get("password") as string;

  if (password === ADMIN_TOKEN) {
    // Generate JWT token
    const token = jwt.sign(
      {
        role: ROLE,
        iat: Math.floor(Date.now() / 1000),
      },
      ADMIN_TOKEN,
      {
        expiresIn: COOKIE_EXPIRY,
      },
    );

    // Set the JWT token in the cookie
    (await cookies()).set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_EXPIRY,
    });
  } else {
    throw new Error("Invalid password");
  }
}

export async function logoutAdmin() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function checkAdminCookie() {
  try {
    const cookie = (await cookies()).get(COOKIE_NAME);
    if (!cookie?.value) {
      return false;
    }

    const decoded = jwt.verify(
      cookie.value,
      ADMIN_TOKEN as string,
    ) as JWTPayload;
    return ROLE === decoded.role;
  } catch (err) {
    return false;
  }
}

export async function requireAdmin(lang: string) {
  const isAdmin = await checkAdminCookie();
  if (!isAdmin) {
    redirect(`/${lang}/console`);
  }
}

export async function analyzeSearch(formData: FormData) {
  const query = formData.get("query") as string;
  const prompt = formData.get("prompt") as string;
  const group = formData.get("group") as string;
  const language = formData.get("language") as string;
  const num = Number.parseInt(formData.get("num") as string);
  const startPublishedDate = formData.get("startPublishedDate") as string;
  const endPublishedDate = formData.get("endPublishedDate") as string;
  const temperature = Number.parseFloat(formData.get("temperature") as string);

  const metadata = { group, language };

  const params: AnalyzeSearchParams = {
    query,
    prompt,
    num,
    startPublishedDate: startPublishedDate || undefined,
    endPublishedDate: endPublishedDate || undefined,
    temperature,
    metadata,
  };

  const response = await fetch(`${API_URL}/v1/search`, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to analyze search: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  const data: AnalyzeResults = await response.json();
  return data;
}

export async function analyzeLinks(formData: FormData) {
  const link = JSON.parse(formData.get("link") as string) as string[];
  const prompt = formData.get("prompt") as string;
  const group = formData.get("group") as string;
  const language = formData.get("language") as string;
  const temperature = Number.parseFloat(formData.get("temperature") as string);

  const metadata = { group, language };

  const params: AnalyzeLinksParams = {
    link,
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
    throw new Error(
      `Failed to analyze link: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  const data: AnalyzeResults = await response.json();
  return data;
}

export async function getAnalysis(analysisId: string): Promise<AnalysisResult> {
  const response = await fetch(
    `${API_URL}/v1/analyses?analysisId=${analysisId}`,
    {
      headers,
      next: {
        revalidate: 2,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get analysis: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  return response.json();
}

export async function deleteAnalysis(analysisId: string) {
  const response = await fetch(`${API_URL}/v1/analyses/delete`, {
    method: "POST",
    headers,
    body: JSON.stringify({ analysisId }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete analysis: ${response.headers.get("x-searchlysis-error")}`,
    );
  }
}

export async function updateAnalysis(formData: FormData) {
  const analysisId = formData.get("analysisId") as string;
  const content = formData.get("content") as string;
  const group = formData.get("group") as string;
  const language = formData.get("language") as string;

  // Get the current analysis to preserve existing metadata
  const currentAnalysis = await getAnalysis(analysisId);
  const metadata = {
    ...currentAnalysis.metadata,
    group: group || undefined,
    language: language || undefined,
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
    throw new Error(
      `Failed to update analysis: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  return response.json() as Promise<AnalysisResult>;
}

export async function listAnalyses(
  pageNum = 1,
  pageSize = 10,
  metadata?: Record<string, any>,
): Promise<AnalysisResult[]> {
  let url = `${API_URL}/v1/analyses/list?pageNum=${pageNum}&pageSize=${pageSize}`;

  if (metadata) {
    url += `&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: 2,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to list analyses: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  return response.json();
}

export async function listAnalysesIds(
  pageNum = 1,
  pageSize = 10,
  metadata?: Record<string, any>,
): Promise<AnalysisResult[]> {
  let url = `${API_URL}/v1/analyses/listIds?pageNum=${pageNum}&pageSize=${pageSize}`;

  if (metadata) {
    url += `&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: 2,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to list analyses ids: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  return response.json();
}

export async function relatedAnalyses(
  pageNum = 1,
  pageSize = 10,
  analysisId: string,
  metadata?: Record<string, any>,
): Promise<AnalysisResult[]> {
  let url = `${API_URL}/v1/analyses/related?pageNum=${pageNum}&pageSize=${pageSize}&analysisId=${analysisId}`;

  if (metadata) {
    url += `&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: 2,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to list related analyses: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  return response.json();
}

export async function getPublishedBlogs(
  pageNum = 1,
  pageSize = 10,
  group?: string,
  language?: string,
): Promise<{ blogs: AnalysisResult[]; total: number }> {
  const metadata = { group, language };

  const blogs = await listAnalyses(pageNum, pageSize, metadata);
  const total = await getTotalBlogs(metadata);
  return { blogs, total };
}

async function getTotalBlogs(metadata?: Record<string, any>): Promise<number> {
  let url = `${API_URL}/v1/analyses/count`;

  if (metadata) {
    url += `?metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: 2,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch total blogs: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  const data = (await response.json()) as any;
  return data.count;
}
