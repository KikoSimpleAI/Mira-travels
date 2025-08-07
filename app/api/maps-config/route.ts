import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if Google Maps API key is configured (server-side only)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ 
        configured: false, 
        message: 'Google Maps API key not configured' 
      })
    }

    // Return configuration status without exposing the actual key
    return NextResponse.json({ 
      configured: true,
      message: 'Google Maps is configured and ready to use'
    })
  } catch (error) {
    console.error('Error checking maps configuration:', error)
    return NextResponse.json({ 
      configured: false, 
      message: 'Error checking configuration' 
    }, { status: 500 })
  }
}
