// src/app/models/event.ts

export interface Event {
  eventId: number;          
  eventName: string;        
  description: string;
  participantsCount: number; 
  duration: number;         
  eventType: string;       
  fundingSource: string;   
  status: string;
}
