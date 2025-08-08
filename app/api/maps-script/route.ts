import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      return new NextResponse('Google Maps API key not configured', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      })
    }

    // Generate the Google Maps script URL with the API key
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
    
    // Return JavaScript that loads the Google Maps script
    const script = `
      (function() {
        if (window.google && window.google.maps) {
          return; // Already loaded
        }
        
        const script = document.createElement('script');
        script.src = '${scriptUrl}';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      })();
    `

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error generating maps script:', error)
    return new NextResponse('Error loading maps script', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
