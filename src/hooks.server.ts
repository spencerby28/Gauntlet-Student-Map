// src/hooks.server.js
import { createSessionClient } from '$lib/server/appwrite';

export async function handle({ event, resolve }) {
  // Initialize locals.user as undefined
  event.locals.user = undefined;
  
  try {
    // Use our helper function to create the Appwrite client.
    const { account } = createSessionClient(event);
    // Store the current logged in user in locals
    event.locals.user = await account.get();
  } catch (error) {
    // User is not logged in, locals.user remains undefined
  }
  
  return resolve(event);
}
