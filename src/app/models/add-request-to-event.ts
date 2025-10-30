// src/app/models/add-request-to-event.ts

// Define interfaces for nested objects first

export interface Department {
  departmentId: number;
  departmentName: string;
}

export interface Region {
  regionId: number;
  regionName: string;
  location: string;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department; // Nested Department object
  role: string;
  region: Region; // Nested Region object
}

export interface EventDetails { // Renamed from Event to avoid conflict with addEvent
  eventId: number;
  eventName: string;
  description: string;
  participantsCount: number;
  duration: number;
  eventType: string;
  fundingSource: string;
  status: string;
}

export interface addRequestToEvent {
  requestId: number;
  user: User; // NEW: Added the User object here
  department: Department; // Nested object
  event?: EventDetails; // Nested object, optional as it might not be assigned
  requestDate: string; // Assuming date comes as a string (e.g., "2025-10-22")
  requestStatus: string;
  groupRequest: boolean;
  justification: string;
  tan_Number: string; // Matches backend's "tan_Number"
  curriculamLink: string; // Matches backend's "curriculamLink"
  noOfParticipants: number;
}
