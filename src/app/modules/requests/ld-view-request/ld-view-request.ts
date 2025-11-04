import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestDetails } from '../../../models/request-details';
import { UserParticipantDetails } from '../../../models/user-participant-details';
import { Request } from '../../../services/requests/request';
import { UserService } from '../../../services/user/user';

@Component({
  selector: 'app-ld-view-request',
  imports: [CommonModule],
  templateUrl: './ld-view-request.html',
  styleUrl: './ld-view-request.css',
})
export class LdViewRequest implements OnInit {
  requestDetails: RequestDetails | null = null;
  participantsDetails: UserParticipantDetails[] = [];
  loading: boolean = false;
  error: string | null = null;
  requestId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly requestService: Request,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    // Get request ID from route parameters
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestId = Number.parseInt(id, 10);
      this.loadRequestDetails();
    } else {
      this.error = 'No request ID provided';
    }
  }

  loadRequestDetails(): void {
    if (!this.requestId) return;

    this.loading = true;
    this.error = null;

    console.log(`Loading request details for ID: ${this.requestId}`);

    // Use the getRequest API to fetch request details
    this.requestService.getRequest(this.requestId).subscribe({
      next: (response: any) => {
        console.log('Raw request API response:', response);
        
        // Handle different possible response formats
        let request: RequestDetails;
        if (response.data) {
          request = response.data;
        } else {
          request = response;
        }
        
        console.log('Processed request data:', request);
        
        this.requestDetails = {
          ...request,
          eventName: request.eventName || 'No Event Assigned',
          departmentName: request.departmentName || 'Unknown Department',
          requestorName: request.requestorName || 'Unknown Requestor'
        };
        
        // Extract participants from the request response
        if (request.participants && Array.isArray(request.participants)) {
          console.log('Found participants in request response:', request.participants);
          this.participantsDetails = request.participants.map(user => ({
            userId: user.userId,
            userName: user.userName || 'Unknown User',
            email: user.email || 'No email provided',
            role: user.role || 'Unknown Role',
            departmentId: user.departmentId || 0,
            departmentName: user.departmentName || 'Unknown Department',
            managerId: user.managerId,
            managerName: user.managerName || 'Unknown Manager',
            regionId: user.regionId,
            regionName: user.regionName || 'Unknown Region'
          }));
          
          console.log('Loaded participants:', this.participantsDetails);
          
          // Also fetch detailed user information for all participants
          this.loadAllUserDetails();
        } else {
          console.log('No participants found in request response');
          this.participantsDetails = [];
          this.loading = false;
        }
        
        console.log('Final requestDetails:', this.requestDetails);
      },
      error: (err: any) => {
        console.error('Error loading request details:', err);
        console.error('Error details:', {
          status: err.status,
          message: err.message,
          error: err.error,
          url: err.url
        });
        
        this.error = `Failed to load request details. ${err.status === 404 ? 'Request not found.' : 'Please try again later.'}`;
        this.loading = false;
      }
    });
  }

  loadAllUserDetails(): void {
    // Use getAllUserDetails API to get comprehensive user information
    this.userService.getAllUserDetails().subscribe({
      next: (allUsers: UserParticipantDetails[]) => {
        console.log('All user details from API:', allUsers);
        
        // Enhance participant details with complete user information
        this.participantsDetails = this.participantsDetails.map(participant => {
          const fullUserDetails = allUsers.find(user => user.userId === participant.userId);
          
          if (fullUserDetails) {
            return {
              ...participant,
              userName: fullUserDetails.userName || participant.userName,
              email: fullUserDetails.email || participant.email,
              role: fullUserDetails.role || participant.role,
              departmentId: fullUserDetails.departmentId || participant.departmentId,
              departmentName: fullUserDetails.departmentName || participant.departmentName,
              managerId: fullUserDetails.managerId || participant.managerId,
              managerName: fullUserDetails.managerName || participant.managerName,
              regionId: fullUserDetails.regionId || participant.regionId,
              regionName: fullUserDetails.regionName || participant.regionName
            };
          }
          
          return participant;
        });
        
        console.log('Enhanced participants with full details:', this.participantsDetails);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading user details:', err);
        // Continue with basic participant info if user details API fails
        console.log('Continuing with basic participant information');
        this.loading = false;
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/dashboard/ld/21']); // Navigate back to LD dashboard
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'priority-low';
      case 'medium':
        return 'priority-medium';
      case 'high':
        return 'priority-high';
      case 'critical':
        return 'priority-critical';
      default:
        return 'priority-default';
    }
  }
}
