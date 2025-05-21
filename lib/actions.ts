"use server";

import type {
  Analysis,
  AnalyzeLinksParams,
  AnalyzeResults,
  AnalyzeSearchParams,
  Content,
} from "@/types/api";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encode, getBaseUrl, getDefaultImage } from "./utils";

const API_URL = "https://searchlysis.com/api";
const ROLE = "admin";
const API_KEY = process.env.SEARCHLYSIS_API_KEY;
const ADMIN_TOKEN = process.env.PASSWORD;
const COOKIE_NAME = `__sl_${encode(new URL(getBaseUrl()).pathname)}`;
const COOKIE_EXPIRY = 60 * 60 * 24 * 28; // 28 days

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
      path: new URL(getBaseUrl()).pathname,
    });
  } else {
    throw new Error("Invalid password");
  }
}

export async function logoutAdmin() {
  (await cookies()).set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: new URL(getBaseUrl()).pathname,
  });
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
    console.error(`checkAdminCookie ${err}`);
    return false;
  }
}

export async function requireAdmin(language: string) {
  const isAdmin = await checkAdminCookie();
  if (!isAdmin) {
    redirect(`/${language}/console`);
  }
}

export async function analyzeSearch(
  formData: FormData,
): Promise<AnalyzeResults> {
  const query = formData.get("query") as string;
  const num = Number.parseInt(formData.get("num") as string);
  const startPublishedDate = formData.get("startPublishedDate") as string;
  const endPublishedDate = formData.get("endPublishedDate") as string;

  const prompt = formData.get("prompt") as string;
  const temperature = Number.parseFloat(formData.get("temperature") as string);
  const responseFormat = JSON.parse(formData.get("responseFormat") as string);

  const group = formData.get("group") as string;
  const language = formData.get("language") as string;
  const metadata = { group, language };

  const params: AnalyzeSearchParams = {
    query,
    num,
    startPublishedDate: startPublishedDate || undefined,
    endPublishedDate: endPublishedDate || undefined,
    prompt,
    temperature,
    responseFormat: responseFormat || undefined,
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

  return (await response.json()) || [];
}

export async function analyzeLinks(
  formData: FormData,
): Promise<AnalyzeResults> {
  const link = JSON.parse(formData.get("link") as string) as string[];

  const prompt = formData.get("prompt") as string;
  const temperature = Number.parseFloat(formData.get("temperature") as string);
  const responseFormat = JSON.parse(formData.get("responseFormat") as string);

  const group = formData.get("group") as string;
  const language = formData.get("language") as string;
  const metadata = { group, language };

  const params: AnalyzeLinksParams = {
    link,
    prompt,
    temperature,
    responseFormat: responseFormat || undefined,
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

  return (await response.json()) || [];
}

export async function getAnalysis(analysisId: string): Promise<Analysis> {
  const response = await fetch(
    `${API_URL}/v1/analyses?analysisId=${analysisId}`,
    {
      headers,
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get analysis: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  return await response.json();
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

export async function updateAnalysis(
  analysisId: string,
  jsonContent?: Content,
  metadata?: Record<string, any>,
): Promise<Analysis> {
  const body = {
    analysisId,
    ...(jsonContent && { jsonContent }),
    ...(metadata && { metadata }),
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

  return await response.json();
}

export async function updateAnalysisWithFormData(
  formData: FormData,
): Promise<Analysis> {
  const analysisId = formData.get("analysisId") as string;
  const jsonContent = formData.get("jsonContent")
    ? JSON.parse(formData.get("jsonContent") as string)
    : undefined;
  const metadata = formData.get("metadata")
    ? JSON.parse(formData.get("metadata") as string)
    : undefined;

  const body = {
    analysisId,
    ...(jsonContent && { jsonContent }),
    ...(metadata && { metadata }),
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

  return await response.json();
}

export async function listAnalyses({
  pageNum = 1,
  pageSize = 10,
  selectFields,
  totalCount,
  textContent,
  jsonContent,
  metadata,
}: {
  pageNum: number;
  pageSize: number;
  selectFields?: string[];
  totalCount?: boolean;
  textContent?: string;
  jsonContent?: Content;
  metadata?: Record<string, any>;
}): Promise<Analysis[]> {
  let url = `${API_URL}/v1/analyses/list?pageNum=${pageNum}&pageSize=${pageSize}`;

  if (selectFields) {
    url += `&selectFields=${encodeURIComponent(selectFields.toString())}`;
  }
  if (totalCount) {
    url += `&totalCount=${totalCount}`;
  }
  if (jsonContent) {
    url += `&jsonContent=${encodeURIComponent(JSON.stringify(jsonContent))}`;
  }
  if (metadata) {
    url += `&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to list analyses: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  return (await response.json()) || [];
}

export async function relatedAnalyses({
  analysisId,
  pageNum = 1,
  pageSize = 10,
  selectFields,
  textContent,
  jsonContent,
  metadata,
}: {
  analysisId: string;
  pageNum: number;
  pageSize: number;
  selectFields?: string[];
  textContent?: string;
  jsonContent?: Content;
  metadata?: Record<string, any>;
}): Promise<Analysis[]> {
  let url = `${API_URL}/v1/analyses/related?pageNum=${pageNum}&pageSize=${pageSize}&analysisId=${analysisId}`;

  if (selectFields) {
    url += `&selectFields=${encodeURIComponent(selectFields.toString())}`;
  }
  if (textContent) {
    url += `&textContent=${encodeURIComponent(textContent)}`;
  }
  if (jsonContent) {
    url += `&jsonContent=${encodeURIComponent(JSON.stringify(jsonContent))}`;
  }
  if (metadata) {
    url += `&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to list related analyses: ${response.headers.get("x-searchlysis-error")}`,
    );
  }

  return (await response.json()) || [];
}

export async function getFilteredAnalyses({
  pageNum = 1,
  pageSize = 10,
  selectFields,
  totalCount = true,
  group,
  language,
  tags,
}: {
  pageNum: number;
  pageSize: number;
  selectFields?: string[];
  totalCount?: boolean;
  group?: string;
  language?: string;
  tags?: string[];
}): Promise<Analysis[]> {
  const metadata =
    group || language
      ? {
          ...(group && { group }),
          ...(language && { language }),
        }
      : undefined;
  const jsonContent = tags && { tags };

  return await listAnalyses({
    pageNum,
    pageSize,
    selectFields,
    totalCount,
    metadata,
    jsonContent,
  });
}

export async function validateImage(url: string): Promise<string> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const contentType = res.headers.get("Content-Type") || "";
    return res.ok && contentType.startsWith("image") ? url : getDefaultImage();
  } catch (err) {
    return getDefaultImage();
  }
}
