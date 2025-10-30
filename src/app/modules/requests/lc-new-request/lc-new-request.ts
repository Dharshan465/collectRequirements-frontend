import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateRequest } from '../../../models/create-request';
import { UserParticipantDetails } from '../../../models/user-participant-details';
import { Request } from '../../../services/requests/request';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserSelection } from '../../requests/user-selection/user-selection';

@Component({
  selector: 'app-lc-new-request',
  imports: [FormsModule,CommonModule, UserSelection],
  templateUrl: './lc-new-request.html',
  styleUrl: './lc-new-request.css',
})
export class LcNewRequest implements OnInit, OnDestroy {

  newRequest: CreateRequest = {
    requestorId: this.lcUserId,
    justification: '',
    groupRequest: false,
    tanNumber: '',
    curriculumLink: '',
    participantUserIds: []
  
  };

  selectedParticipantsDisplay: UserParticipantDetails[] = [];
  showUserSelectionPopup: boolean = false; 

    private userSelectionSubscription: Subscription | undefined; // For modal communication


  constructor(
    private readonly requestService: Request,
    private readonly userService: UserService,
    private readonly router: Router
    
  ) { }

  ngOnInit(): void {
      this.userSelectionSubscription = this.userService.selectedUsers$.subscribe(users => {
      this.selectedParticipantsDisplay = users;
      this.newRequest.participantUserIds = users.map(user => user.userId); // Update IDs for submission
      this.updateGroupRequestStatus(); // Automatically update group request status
    });

 
  }

  ngOnDestroy(): void {
    this.userSelectionSubscription?.unsubscribe();
  }


  onSubmit(): void {
     this.requestService.createRequest(this.newRequest).subscribe({
      next: (response) => {
        console.log('Request created successfully:', response);
        alert('Request submitted successfully!');
        this.router.navigate(['/dashboard/lc/' + this.lcUserId]);
      },
      error: (err) => {
        console.error('Error creating request:', err);
        alert('Failed to submit request: ' + (err.error?.message || err.message));
      }
    });

    console.log('Submitting new request:', this.newRequest);
  }

get lcUserId(): number {
    const urlSegments = window.location.pathname.split('/');
    const userIdIndex = urlSegments.indexOf('lc') + 1;
    return userIdIndex > 0 ? parseInt(urlSegments[userIdIndex], 10) : NaN;
  }

 openUserSelectionPopup(): void {
    this.showUserSelectionPopup = true;
    console.log('Open user selection popup');
  }

  onModalSelectionConfirmed(selectedUsers: UserParticipantDetails[]): void {
    this.selectedParticipantsDisplay = selectedUsers;
    this.newRequest.participantUserIds = selectedUsers.map(user => user.userId);
    this.updateGroupRequestStatus(); // Automatically update group request status
    this.showUserSelectionPopup = false;
  }

  onModalClose(): void {
    this.showUserSelectionPopup = false;
  }

  removeParticipant(userId: number): void{
    this.selectedParticipantsDisplay = this.selectedParticipantsDisplay.filter(user => user.userId !== userId);
    this.newRequest.participantUserIds = this.newRequest.participantUserIds.filter(id => id !== userId);
    this.updateGroupRequestStatus(); // Automatically update group request status
    console.log('Removing participant with userId:', userId);
  }

  navigateBack(): void {
    this.router.navigate(['/dashboard/lc/' + this.lcUserId]);
  }

  updateGroupRequestStatus(): void {
    if(this.selectedParticipantsDisplay.length > 10){
      this.newRequest.groupRequest = true;
    } else {
      this.newRequest.groupRequest = false;
    }
  }

}


