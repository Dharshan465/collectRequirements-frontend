import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestDetails } from '../../../models/request-details';
import { UserParticipantDetails } from '../../../models/user-participant-details';
import { EditRequest } from '../../../models/edit-request';
import { Request } from '../../../services/requests/request';
import { UserService } from '../../../services/user/user';

@Component({
  selector: 'app-ld-edit-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './ld-edit-request.html',
  styleUrl: './ld-edit-request.css',
})
export class LdEditRequest implements OnInit {
  requestDetails: RequestDetails | null = null;
  participantsDetails: UserParticipantDetails[] = [];
  allUsers: UserParticipantDetails[] = [];
  filteredUsers: UserParticipantDetails[] = [];
  loading: boolean = false;
  error: string | null = null;
  requestId: number | null = null;
  isSubmitting: boolean = false;
  
  // Message handling properties
  successMessage: string | null = null;
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  
  // Current user info - this could be injected from a user service in the future
  private readonly currentUserId: number = 21; // LnD user ID - can be made dynamic later
  
  // Modal and search properties
  showAddParticipantModal: boolean = false;
  searchQuery: string = '';
  searchFilters = {
    role: '',
    manager: '',
    region: '',
    department: '',
    name: ''
  };

  // Available status options
  statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

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
      this.loadAllUsers();
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
        } else {
          console.log('No participants found in request response');
          this.participantsDetails = [];
        }
        
        // Update participant count
        if (this.requestDetails) {
          this.requestDetails.noOfParticipants = this.participantsDetails.length;
        }
        
        console.log('Final requestDetails:', this.requestDetails);
        this.loading = false;
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

  loadAllUsers(): void {
    // Load all users for the user selection functionality
    this.userService.getAllUserDetails().subscribe({
      next: (users: UserParticipantDetails[]) => {
        console.log('All users loaded:', users);
        this.allUsers = users;
      },
      error: (err: any) => {
        console.error('Error loading all users:', err);
        // Continue without all users data
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

  removeParticipant(participantId: number): void {
    this.participantsDetails = this.participantsDetails.filter(p => p.userId !== participantId);
    
    // Update participant count
    if (this.requestDetails) {
      this.requestDetails.noOfParticipants = this.participantsDetails.length;
    }
    
    console.log('Participant removed. Current participants:', this.participantsDetails);
  }

  addParticipant(user: UserParticipantDetails): void {
    // Check if user is already in participants
    const existingParticipant = this.participantsDetails.find(p => p.userId === user.userId);
    
    if (!existingParticipant) {
      this.participantsDetails.push({
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        departmentName: user.departmentName,
        managerId: user.managerId,
        managerName: user.managerName,
        regionId: user.regionId,
        regionName: user.regionName
      });
      
      // Update participant count
      if (this.requestDetails) {
        this.requestDetails.noOfParticipants = this.participantsDetails.length;
      }
      
      // Refresh filtered users to remove the newly added participant
      this.applyFilters();
      
      console.log('Participant added. Current participants:', this.participantsDetails);
    }
  }

  getAvailableUsers(): UserParticipantDetails[] {
    // Return filtered users when modal is open, otherwise return empty array for performance
    return this.showAddParticipantModal ? this.filteredUsers : [];
  }

  // Modal Management
  openAddParticipantModal(): void {
    this.showAddParticipantModal = true;
    this.resetSearchFilters();
    this.applyFilters();
  }

  closeAddParticipantModal(): void {
    this.showAddParticipantModal = false;
    this.resetSearchFilters();
  }

  // Search and Filter Methods
  resetSearchFilters(): void {
    this.searchQuery = '';
    this.searchFilters = {
      role: '',
      manager: '',
      region: '',
      department: '',
      name: ''
    };
    this.filteredUsers = [...this.allUsers];
  }

  onSearchQueryChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allUsers];

    // Exclude users who are already participants
    const participantUserIds = new Set(this.participantsDetails.map(p => p.userId));
    filtered = filtered.filter(user => !participantUserIds.has(user.userId));

    // Apply text search across all fields
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.userName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.departmentName.toLowerCase().includes(query) ||
        user.managerName?.toLowerCase().includes(query) ||
        user.regionName?.toLowerCase().includes(query)
      );
    }

    // Apply specific filters
    if (this.searchFilters.name.trim()) {
      const nameQuery = this.searchFilters.name.toLowerCase();
      filtered = filtered.filter(user => 
        user.userName.toLowerCase().includes(nameQuery)
      );
    }

    if (this.searchFilters.role.trim()) {
      const roleQuery = this.searchFilters.role.toLowerCase();
      filtered = filtered.filter(user => 
        user.role.toLowerCase().includes(roleQuery)
      );
    }

    if (this.searchFilters.department.trim()) {
      const deptQuery = this.searchFilters.department.toLowerCase();
      filtered = filtered.filter(user => 
        user.departmentName.toLowerCase().includes(deptQuery)
      );
    }

    if (this.searchFilters.manager.trim()) {
      const managerQuery = this.searchFilters.manager.toLowerCase();
      filtered = filtered.filter(user => 
        user.managerName?.toLowerCase().includes(managerQuery)
      );
    }

    if (this.searchFilters.region.trim()) {
      const regionQuery = this.searchFilters.region.toLowerCase();
      filtered = filtered.filter(user => 
        user.regionName?.toLowerCase().includes(regionQuery)
      );
    }

    this.filteredUsers = filtered;
  }

  updateRequest(): void {
    if (!this.requestDetails || !this.requestId) {
      console.log('No request details or ID available');
      this.showErrorMessage('Unable to update request: Missing request data');
      return;
    }

    if (!this.isFormValid()) {
      this.showErrorMessage('Please fill in all required fields before updating');
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    try {
      // Prepare the update payload using EditRequest model
      const updatePayload: EditRequest = {
        requestId: this.requestId,
        requestorId: this.requestDetails.requestorId,
        approvedBy: this.currentUserId, // Current LnD user who is making the changes
        departmentId: this.requestDetails.departmentId,
        eventId: this.requestDetails.eventId || null, // Default to 0 if no event
        requestDate: this.requestDetails.requestDate,
        requestStatus: this.requestDetails.requestStatus,
        groupRequest: this.requestDetails.groupRequest,
        justification: this.requestDetails.justification,
        curriculamLink: this.requestDetails.curriculumLink || '',
        tan_Number: this.requestDetails.tanNumber,
        requestedParticipants: this.participantsDetails.map(p => p.userId)
      };

      console.log('Updating request with payload:', updatePayload);

      // Call the API to update the request
      this.requestService.editRequest(this.requestId, updatePayload).subscribe({
        next: (response: RequestDetails) => {
          console.log('Request updated successfully:', response);
          this.isSubmitting = false;
          this.showSuccessMessage('Request updated successfully!');
          
          // Update local data with response
          this.requestDetails = response;
          
          // Optional: Navigate back to dashboard after a short delay
          setTimeout(() => {
            this.navigateBack();
          }, 2000);
        },
        error: (error) => {
          console.error('Error updating request:', error);
          this.isSubmitting = false;
          
          let errorMessage = 'Failed to update request. Please try again.';
          
          if (error.status === 400) {
            errorMessage = 'Invalid request data. Please check your inputs.';
          } else if (error.status === 401) {
            errorMessage = 'You are not authorized to update this request.';
          } else if (error.status === 404) {
            errorMessage = 'Request not found. It may have been deleted.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.showErrorMessage(errorMessage);
        }
      });
    } catch (error) {
      console.error('Unexpected error during update:', error);
      this.isSubmitting = false;
      this.showErrorMessage('An unexpected error occurred. Please try again.');
    }
  }

  // Helper methods for showing messages
  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    this.showErrorAlert = false;
    this.error = null;
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      this.showSuccessAlert = false;
      this.successMessage = null;
    }, 5000);
  }

  private showErrorMessage(message: string): void {
    this.error = message;
    this.showErrorAlert = true;
    this.showSuccessAlert = false;
    this.successMessage = null;
  }

  // Method to manually close alerts
  closeAlert(): void {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.successMessage = null;
    this.error = null;
  }

  isFormValid(): boolean {
    return !!(this.requestDetails?.justification && 
              this.requestDetails?.tanNumber && 
              this.requestDetails?.requestStatus &&
              this.participantsDetails.length > 0); // At least one participant required
  }
}
