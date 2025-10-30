// src/app/models/event-creation-request-dto.ts
import { addEvent } from './add-event'; // Import the renamed addEvent interface

export interface EventCreationRequestDTO {
  newEvent: addEvent; // Use the renamed addEvent interface
  requests: number[]; // A list of selected request IDs
}
