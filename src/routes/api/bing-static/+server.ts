import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const zoom = url.searchParams.get('zoom');
  const width = url.searchParams.get('w') || '640';
  const height = url.searchParams.get('h') || '400';

  if (!lat || !lng || !zoom) {
    return new Response('Missing params', { status: 400 });
  }

  const key = env.BING_MAPS_API_KEY;
  if (!key) {
    return new Response('No Bing API key configured', { status: 500 });
  }

  const bingUrl = `https://dev.virtualearth.net/REST/v1/Imagery/Map/Aerial/${lat},${lng}/${zoom}?mapSize=${width},${height}&key=${key}`;

  const res = await fetch(bingUrl);
  if (!res.ok) {
    return new Response('Bing API error', { status: res.status });
  }

  const imageBuffer = await res.arrayBuffer();

  return new Response(imageBuffer, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
