import { GOOGLE_MAPS_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Location } from '$lib/types/location';

// US states array for validation
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC'
];

async function getCoordinates(city: string, state: string): Promise<[number, number]> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?` +
    new URLSearchParams({
      address: `${city}, ${state}`,
      key: GOOGLE_MAPS_API_KEY
    })
  );

  const data = await response.json();

  if (data.status === 'OK' && data.results[0]?.geometry?.location) {
    const { lng, lat } = data.results[0].geometry.location;
    return [lng, lat];
  }

  throw new Error(`Failed to get coordinates for ${city}, ${state}`);
}

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('query');
  const needsCoords = url.searchParams.get('coords') === 'true';

  if (!query) {
    return json({ predictions: [] });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      new URLSearchParams({
        input: query,
        types: '(cities)',
        key: GOOGLE_MAPS_API_KEY,
        components: 'country:us' // Restrict to US only
      })
    );

    const data = await response.json();

    if (data.status === 'OK') {
      const predictions = await Promise.all(
        data.predictions
          .map(async (prediction: any) => {
            const terms = prediction.terms;
            const city = terms[0].value;
            const state = terms[1]?.value || '';
            
            // Skip if not a valid US state
            if (!state || !US_STATES.includes(state.toUpperCase())) {
              return null;
            }
            
            let coordinates: [number, number] = [0, 0];
            
            if (needsCoords) {
              try {
                coordinates = await getCoordinates(city, state);
              } catch (error) {
                console.error('Failed to get coordinates:', error);
              }
            }
            
            return {
              city,
              state,
              coordinates
            } satisfies Location;
          })
      ).then(results => results.filter((result): result is Location => result !== null));

      return json({ predictions });
    } else {
      console.error('Google Places API error:', data.status, data.error_message);
      return json({ predictions: [] });
    }

  } catch (error) {
    console.error('Failed to fetch predictions:', error);
    return json({ predictions: [] });
  }
};
