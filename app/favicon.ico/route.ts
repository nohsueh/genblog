import { getDefaultFavicon } from "@/lib/utils";

export async function GET() {
  const iconUrl = getDefaultFavicon();
  const response = await fetch(iconUrl);
  const arrayBuffer = await response.arrayBuffer();
  const headers = new Headers();
  headers.set("Content-Type", "image/x-icon");
  headers.set("Cache-Control", "public, max-age=31536000");

  return new Response(arrayBuffer, {
    headers,
  });
}
