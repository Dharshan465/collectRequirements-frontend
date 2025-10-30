// src/app/models/event.ts

export interface Event {
  eventId: number;          // Changed from event_id to eventId
  eventName: string;        // Changed from event_name to eventName
  description: string;
  participantsCount: number; // Changed from participants_count to participantsCount
  duration: number;         // Changed from string to number based on your JSON (30, 0)
  eventType: string;        // Changed from event_type to eventType
  fundingSource: string;    // Changed from funding_source to fundingSource
  status: string;
}
