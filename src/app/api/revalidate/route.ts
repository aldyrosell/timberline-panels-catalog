import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { CONTENT_TAGS } from "@/lib/sanity/content";

type WebhookPayload = { _type?: string };

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not set on this deployment." },
      { status: 500 },
    );
  }

  const { body, isValidSignature } = await parseBody<WebhookPayload>(request, secret);

  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const type = body?._type;

  if (!type || !CONTENT_TAGS.includes(type as (typeof CONTENT_TAGS)[number])) {
    return NextResponse.json({ message: `Ignored document type: ${type ?? "unknown"}` });
  }

  // expire: 0 purges immediately; a profile name would leave a stale window.
  revalidateTag(type, { expire: 0 });

  return NextResponse.json({ revalidated: true, tag: type, now: Date.now() });
}
