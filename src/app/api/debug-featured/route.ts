import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("key")
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid key" }, { status: 401 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
  const url = `${baseUrl}/wp-json/urbankey/v1/properties?featured=true&per_page=6`

  const response = await fetch(url, { cache: "no-store" })
  const text = await response.text()

  let parsed: unknown = null
  try {
    parsed = JSON.parse(text)
  } catch {
    // leave parsed as null, raw text is returned below
  }

  return Response.json({
    envBaseUrl: baseUrl,
    requestedUrl: url,
    responseStatus: response.status,
    responseHeaders: Object.fromEntries(response.headers.entries()),
    parsedCount:
      parsed && typeof parsed === "object" && "data" in parsed
        ? (parsed as { data: unknown[] }).data.length
        : null,
    rawBodyPreview: text.slice(0, 500),
  })
}
