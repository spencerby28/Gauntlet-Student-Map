import { redirect } from '@sveltejs/kit';
import { createSessionClient, createAnonClient, createAdminClient } from '$lib/server/appwrite';
import { error, type Actions } from '@sveltejs/kit';
import type { LocationEntry, AppwriteLocationEntry } from '$lib/types/location';
import type { Topology, GeometryCollection } from 'topojson-specification';
import { ID, OAuthProvider } from 'node-appwrite';
import transformAppwriteLocation from '$lib/utils/transformAppwriteLocation';
import type { PageServerLoad } from './$types';

interface PageData {
  locations: LocationEntry[];
  geojson: Topology<{
    states: GeometryCollection<{ name: string }>;
  }>;
  hasSubmitted: boolean;
  user: any;
}

export const load = (async (event) => {
  try {
    const user = event.locals.user;
    console.log('[+page.server.ts] Loading page data. User state:', user ? user.$id : 'not logged in');

    // Load both data sources in parallel
    const [locationsPromise, geojsonPromise] = await Promise.all([
      // Load locations from Appwrite using anonymous client for public reads
      (async () => {
        const client = createAnonClient();
        const response = await client.databases.listDocuments(
          'users',  // database ID
          'locations'  // collection ID
        );
        return response.documents.map(doc => transformAppwriteLocation(doc as unknown as AppwriteLocationEntry));
      })(),
      // Load geojson
      (async () => {
        const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
        return response.json();
      })()
    ]);

    const locations = locationsPromise;
    const geojson = geojsonPromise;

    // Check if current user has already submitted (only if logged in)
    const hasSubmitted = user ? locations.some(loc => loc.userId === user.$id) : false;

    console.log('[+page.server.ts] Finished loading data. hasSubmitted:', hasSubmitted);

    return {
      locations,
      geojson,
      hasSubmitted,
      user
    } satisfies PageData;
  } catch (e) {
    console.error('Error loading data:', e);
    throw error(500, 'Failed to load map data');
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  addLocation: async ({ request, locals, cookies }) => {
    const data = await request.formData();
    
    // Get the current user or throw error if not authenticated
    if (!locals.user) {
      throw error(401, 'Not authenticated');
    }

    try {
      const currentLocation = JSON.parse(data.get('currentLocation') as string);
      const hometown = JSON.parse(data.get('hometown') as string);

      const client = createSessionClient({ cookies });

      const locationEntry: AppwriteLocationEntry = {
        userId: locals.user.$id,
        current_city: currentLocation.city,
        current_state: currentLocation.state,
        current_coordinates: currentLocation.coordinates,
        hometown_city: hometown.city,
        hometown_state: hometown.state,
        hometown_coordinates: hometown.coordinates
      };

      await client.databases.createDocument(
        'users', // database ID
        'locations',         // collection ID
        ID.unique(),
        locationEntry
      );

      return { success: true };

    } catch (e) {
      console.error('Failed to save location:', e);
      throw error(500, 'Failed to save location information');
    }
  },

  oauth: async (event) => {
    const { account } = createAdminClient();
    console.log(event.url.origin);

    const redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Discord,
      `${event.url.origin}/oauth`,
      `${event.url.origin}/`
    );
    console.log(redirectUrl);

    throw redirect(302, redirectUrl);
  }
};
