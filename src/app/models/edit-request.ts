export interface EditRequest {
  requestId: number;
  requestorId: number;
  approvedBy: number;
  approvalNotes:string,
  departmentId: number;
  eventId: number | null;
  requestDate: string;
  requestStatus: string;
  groupRequest: boolean;
  justification: string;
  curriculamLink: string;
  requestedParticipants: number[];
  tan_Number: string;
}