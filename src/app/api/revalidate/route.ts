import type { NextRequest } from "next/server"
import { revalidateTag, revalidatePath } from "next/cache"

interface RevalidateBody {
  post_type?: string
  slug?: string
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret")

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid secret" }, { status: 401 })
  }

  let body: RevalidateBody = {}
  try {
    body = (await request.json()) as RevalidateBody
  } catch {
    // body is optional — fall through to full revalidation
  }

  const { post_type, slug } = body

  if (post_type === "property") {
    revalidateTag("properties", { expire: 0 })
    revalidatePath("/properties")
    revalidatePath("/")
    if (slug) revalidatePath(`/properties/${slug}`)
  } else if (post_type === "uk_agent") {
    revalidateTag("agents", { expire: 0 })
  } else {
    revalidateTag("properties", { expire: 0 })
    revalidateTag("agents", { expire: 0 })
    revalidatePath("/")
    revalidatePath("/properties")
  }

  return Response.json({ revalidated: true, now: Date.now() })
}
