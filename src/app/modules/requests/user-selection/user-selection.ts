import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserParticipantDetails } from '../../../models/user-participant-details';
import { UserService } from '../../../services/user/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-selection',
  imports: [FormsModule,CommonModule],
  templateUrl: './user-selection.html',
  styleUrl: './user-selection.css',
})
export class UserSelection implements OnInit {
 @Input() initialSelectedUsers: UserParticipantDetails[] = [];
  @Output() selectionConfirmed = new EventEmitter<UserParticipantDetails[]>();
  @Output() close = new EventEmitter<void>();

  allUsers: UserParticipantDetails[] = [];
  filteredUsers: UserParticipantDetails[] = [];
  selectedUsers: UserParticipantDetails[] = [];

  // Filter object for multiple search criteria
  filters = {
    username: '',
    departmentName: '',
    managerName: '',
    regionName: ''
  };

  constructor(private readonly userService: UserService) { }

  ngOnInit(): void {
    this.selectedUsers = [...this.initialSelectedUsers];
    this.userService.getAllUserDetails().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.applyFilter();
      },
      error: (err) => console.error('Error fetching users for selection', err)
    });
  }

  applyFilter(): void {
    // Check if any filter has a value
    const hasActiveFilters = this.filters.username || this.filters.departmentName || 
                           this.filters.managerName || this.filters.regionName;

    if (!hasActiveFilters) {
      this.filteredUsers = this.allUsers;
    } else {
      this.filteredUsers = this.allUsers.filter(user => {
        const matchesUsername = !this.filters.username || 
          user.userName.toLowerCase().includes(this.filters.username.toLowerCase());
        
        const matchesDepartment = !this.filters.departmentName || 
          user.departmentName.toLowerCase().includes(this.filters.departmentName.toLowerCase());
        
        const matchesManager = !this.filters.managerName || 
          user.managerName.toLowerCase().includes(this.filters.managerName.toLowerCase());
        
        const matchesRegion = !this.filters.regionName || 
          user.regionName.toLowerCase().includes(this.filters.regionName.toLowerCase());

        // Return true only if ALL active filters match
        return matchesUsername && matchesDepartment && matchesManager && matchesRegion;
      });
    }
  }

  clearAllFilters(): void {
    this.filters = {
      username: '',
      departmentName: '',
      managerName: '',
      regionName: ''
    };
    this.applyFilter();
  }

  isUserSelected(user: UserParticipantDetails): boolean {
    return this.selectedUsers.some(su => su.userId === user.userId);
  }

  toggleUserSelection(user: UserParticipantDetails): void {
    if (this.isUserSelected(user)) {
      this.selectedUsers = this.selectedUsers.filter(su => su.userId !== user.userId);
    } else {
      this.selectedUsers = [...this.selectedUsers, user];
    }
  }

  confirmSelection(): void {
    this.selectionConfirmed.emit(this.selectedUsers);
    this.close.emit();
  }

  cancelSelection(): void {
    this.close.emit();
  }
}
