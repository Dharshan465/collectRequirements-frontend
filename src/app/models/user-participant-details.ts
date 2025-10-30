export interface UserParticipantDetails {
  userId: number;
  userName: string;
  email: string;
  departmentId: number;
  departmentName: string;
  role: string;
  regionId?: number;
  regionName: string;
  managerId?: number; 
  managerName: string;
}
