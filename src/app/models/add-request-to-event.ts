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
  department: Department; 
  event?: EventDetails; 
  requestDate: string;
  requestStatus: string;
  groupRequest: boolean;
  justification: string;
  tan_Number: string; 
  curriculamLink: string; 
  noOfParticipants: number;
}
