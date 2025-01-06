import type { AppwriteLocationEntry, LocationEntry } from '$lib/types/location';
import type { Models } from 'node-appwrite';

export default function transformAppwriteLocation(location: AppwriteLocationEntry): LocationEntry {
    const appwriteDoc = location as Models.Document & AppwriteLocationEntry;
    return {
      $id: appwriteDoc.$id,
      $createdAt: appwriteDoc.$createdAt,
      $updatedAt: appwriteDoc.$updatedAt,
      $collectionId: appwriteDoc.$collectionId,
      $databaseId: appwriteDoc.$databaseId,
      $permissions: appwriteDoc.$permissions,
      userId: appwriteDoc.userId,
      currentLocation: {
        city: appwriteDoc.current_city,
        state: appwriteDoc.current_state,
        coordinates: appwriteDoc.current_coordinates
      },
      hometown: {
        city: appwriteDoc.hometown_city,
        state: appwriteDoc.hometown_state,
        coordinates: appwriteDoc.hometown_coordinates
      }
    };
  }