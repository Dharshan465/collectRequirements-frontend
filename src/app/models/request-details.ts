export interface RequestDetails {
  requestId: number;
  requestorId: number;
  requestorName: string;
  departmentId: number;
  departmentName: string;
  eventId?: number;
  eventName: string;
  requestDate: string; 
  requestStatus: string;
  groupRequest: boolean;
  justification: string;
  noOfParticipants: number;
  tanNumber: string;
  curriculumLink: string;
}
