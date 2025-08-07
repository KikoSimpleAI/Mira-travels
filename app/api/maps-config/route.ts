import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      scriptUrl: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`,
      configured: true
    })
  } catch (error) {
    console.error('Error serving maps config:', error)
    return NextResponse.json(
      { error: 'Failed to load maps configuration' },
      { status: 500 }
    )
  }
}
