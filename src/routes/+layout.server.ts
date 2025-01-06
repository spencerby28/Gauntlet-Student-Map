import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  console.log('[+layout.server.ts] Loading layout data. User state:', locals.user ? locals.user.$id : 'not logged in');
  return {
    user: locals.user
  };
}; 