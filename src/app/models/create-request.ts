export interface CreateRequest {
  requestorId: number;
  justification: string;
  groupRequest: boolean;
  tanNumber: string;
  curriculumLink: string;
  participantUserIds: number[]; // Array of user IDs
}
