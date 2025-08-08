import 'server-only'

export async function GET(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return new Response('Google Maps API key is not configured on the server.', { status: 500 })
    }

    const incomingUrl = new URL(req.url)
    const upstream = new URL('https://maps.googleapis.com/maps/api/js')

    // Only forward a safe allowlist of query params
    const allowParams = [
      'v',
      'callback',
      'language',
      'region',
      'libraries',
      'channel',
      'loading',
      'map_ids',
    ]

    for (const [key, value] of incomingUrl.searchParams.entries()) {
      if (allowParams.includes(key)) {
        upstream.searchParams.append(key, value)
      }
    }

    // Always inject the server-only key
    upstream.searchParams.set('key', apiKey)

    const res = await fetch(upstream.toString(), {
      method: 'GET',
      // Optional: pass-through compression headers from the platform
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return new Response(`Failed to fetch Google Maps JS: ${res.status} ${text}`, {
        status: res.status,
      })
    }

    const js = await res.text()

    return new Response(js, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err: any) {
    return new Response(`Unexpected error fetching Google Maps JS: ${err?.message ?? 'Unknown error'}`, {
      status: 500,
    })
  }
}
