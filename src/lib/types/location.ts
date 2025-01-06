import type { Models } from 'node-appwrite';

export interface Location {
  city: string;
  state: string;
  coordinates: [number, number];  // [longitude, latitude]
}

export interface LocationEntry extends Models.Document {
  userId: string;            // Reference to authenticated user
  currentLocation: Location;
  hometown: Location;
}

// Helper type for creating a new location entry
export type NewLocationEntry = Omit<LocationEntry, '$id' | '$createdAt'>;

// Helper type for updating an existing location entry
export type UpdateLocationEntry = Partial<Omit<LocationEntry, '$id' | 'userId' | '$createdAt'>>;

// Appwrite document structure (flattened for storage)
export interface AppwriteLocationEntry {
  userId: string;
  current_city: string;
  current_state: string;
  current_coordinates: [number, number];
  hometown_city: string;
  hometown_state: string;
  hometown_coordinates: [number, number];
}