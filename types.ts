export interface Monument {
  id: string;
  name: string;
  shortDescription: string;
  fullHistory: string;
  position: { lat: number; lng: number }; // Real-world coordinates
  placeId?: string; // Google Maps Place ID for fetching details
  imageUrl: string; // Default/Fallback URL
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  image?: string; // Base64 or URL
  audio?: boolean; // If true, indicates an audio message was sent
  timestamp: number;
}

export interface Coordinates {
  x: number;
  y: number;
}