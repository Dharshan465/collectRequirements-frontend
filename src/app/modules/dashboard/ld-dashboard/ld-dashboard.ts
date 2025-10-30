import { Component, OnInit } from '@angular/core';
import { RequestCounts } from '../../../models/request-counts';
import { Request } from '../../../services/requests/request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestDetails } from '../../../models/request-details';

@Component({
  selector: 'app-ld-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './ld-dashboard.html',
  styleUrls: ['./ld-dashboard.css'],
})
export class LdDashboard implements OnInit {

 private readonly ldUserId: number = 21; 

   filterStatus: string = '';
   filterRequestorName: string = '';
    filterDepartmentName: string = '';
    filterEventName: string = '';
    filterFromDate: string = '';
    filterToDate: string = '';
  
  
    requestCounts: RequestCounts = {} as RequestCounts;
    requestDetails: RequestDetails[] = [];

  availableStatuses: string[] = [];
  availableDepartments: string[] = [];
  availableEvents: string[] = [];
  availableRequestorNames: string[] = [];


  constructor(private readonly requestService: Request) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadRequestCounts();
    this.loadRequests();
  }

  loadRequestCounts(): void {
    this.requestService.getAllRequestCounts(this.ldUserId).subscribe({
      next: (data) => this.requestCounts = data,
      error: (err) => console.error('Error fetching request counts', err)
    });
  }

  loadRequests(): void {
    console.log('Loading requests with filters:');
    this.requestService.getAllRequests(
      this.ldUserId,
      this.filterStatus,
      this.filterRequestorName,
      this.filterDepartmentName,
      this.filterEventName,
      this.filterFromDate,
      this.filterToDate
    ).subscribe({
              next: (data) => {
                this.requestDetails = data;
                this.populateFilterOptions();
      },
      error: (err) => console.error('Error fetching request details', err)
    });
    console.log('Requests loaded for LnD User ID:', this.ldUserId);
    console.log('Current Filters - Status:', this.filterStatus, 'Requestor Name:', this.filterRequestorName, 'Department Name:', this.filterDepartmentName, 'Event Name:', this.filterEventName, 'From Date:', this.filterFromDate, 'To Date:', this.filterToDate);
    console.log('Request Details:', this.requestDetails);
  }


   populateFilterOptions(): void {
    this.availableStatuses = [];
    this.availableDepartments = [];
    this.availableEvents = [];
    this.availableRequestorNames = [];

    const statusSet = new Set<string>();
    const departmentSet = new Set<string>();
    const eventSet = new Set<string>();
    const requestorNameSet = new Set<string>();


    for (const detail of this.requestDetails) {
      if (detail.requestStatus) statusSet.add(detail.requestStatus);
      if (detail.departmentName) departmentSet.add(detail.departmentName);
      if (detail.eventName) eventSet.add(detail.eventName);
      if (detail.requestorName) requestorNameSet.add(detail.requestorName);
    }

    this.availableStatuses = Array.from(statusSet).sort((a, b) => a.localeCompare(b));
    this.availableDepartments = Array.from(departmentSet).sort((a, b) => a.localeCompare(b));
    this.availableEvents = Array.from(eventSet).sort((a, b) => a.localeCompare(b));
    this.availableRequestorNames = Array.from(requestorNameSet).sort((a, b) => a.localeCompare(b));

    console.log('Available Statuses:', this.availableStatuses);
    console.log('Available Departments:', this.availableDepartments);
    console.log('Available Events:', this.availableEvents);
    console.log('Available Requestor Names:', this.availableRequestorNames);
  }

  clear(): void {
    this.filterStatus = '';
    this.filterRequestorName = '';
    this.filterDepartmentName = '';
    this.filterEventName = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.loadRequests(); 
  }

  navigateToNewRequirement(): void {
    // Logic to navigate to the new requirement page
  }

  onEdit(requestId: number): void {
    console.log(`Edit clicked for Request ID: ${requestId}`);
    // Implement navigation to edit page
  }

  onView(requestId: number): void {
    console.log(`View clicked for Request ID: ${requestId}`);
    // Implement navigation to view page
  }

  onDelete(requestId: number): void {
    console.log(`Delete clicked for Request ID: ${requestId}`);
    // Implement delete functionality
  }

}
