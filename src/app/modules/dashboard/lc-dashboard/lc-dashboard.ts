import { Component, OnInit } from '@angular/core';
import { RequestCounts } from '../../../models/request-counts';
import { RequestDetails } from '../../../models/request-details';
import { Request } from '../../../services/requests/request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-lc-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './lc-dashboard.html',
  styleUrls: ['./lc-dashboard.css'],
})
export class LcDashboard implements OnInit {

  private readonly lcUserId: number = 16;

  filterStatus: string = '';
  filterDepartmentName: string = '';
  filterEventName: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';

  availableStatuses: string[] = [];
  availableDepartments: string[] = [];
  availableEvents: string[] = [];

  requestCounts: RequestCounts = {} as RequestCounts;
  requestDetails: RequestDetails[] = [];
  filteredRequestDetails: RequestDetails[] = []; // For display
  allRequestDetails: RequestDetails[] = []; // For maintaining filter options

  constructor(private readonly requestService: Request) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    console.log('Loading dashboard with filters:');
    this.loadRequestCounts();
    this.loadRequests();
  }

  loadRequestCounts(): void {
    console.log('Loading request counts for LC User ID:', this.lcUserId);
    this.requestService.getRequestCounts(this.lcUserId).subscribe({
      next: (data) => this.requestCounts = data,
      error: (err) => console.error(`Error fetching request counts for LC User ID: ${this.lcUserId}`, err),
    });
  }

  loadRequests(): void {
    console.log('Loading requests for LC User ID:', this.lcUserId);
    this.requestService.getRequests(
      this.lcUserId,
      this.filterStatus || undefined,
      this.filterDepartmentName || undefined,
      this.filterEventName || undefined,
      this.filterFromDate || undefined,
      this.filterToDate || undefined
    ).subscribe({
      next: (data) => {
        // Sort data by requestDate in descending order (newest first)
        const sortedData = data.sort((a, b) => 
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
        );
        
        this.allRequestDetails = sortedData; // Store all requests for filter options
        this.requestDetails = sortedData; // Store all for template compatibility
        this.applyMainViewFilter(); // Apply filtering for main view
        this.populateFilterOptions(); 
      },
      error: (err) => console.error(`Error fetching requests for LC User ID: ${this.lcUserId}`, err)
    });
  }

  applyMainViewFilter(): void {
    // If no specific status filter is applied, hide rejected/closed requests
    if (!this.filterStatus) {
      this.filteredRequestDetails = this.requestDetails.filter(request => 
        request.requestStatus !== 'REJECTED' && 
        request.requestStatus !== 'CLOSED' &&
        request.requestStatus !== 'Rejected' &&
        request.requestStatus !== 'Closed'
      );
    } else {
      // If user is searching for specific status, show all matching results
      this.filteredRequestDetails = this.requestDetails;
    }
  }

  populateFilterOptions(): void {
    this.availableStatuses = [];
    this.availableDepartments = [];
    this.availableEvents = [];

    const statusSet = new Set<string>();
    const departmentSet = new Set<string>();
    const eventSet = new Set<string>();

    // Use all requests (including rejected) for filter options
    for (const detail of this.allRequestDetails) {
      if (detail.requestStatus) statusSet.add(detail.requestStatus);
      if (detail.departmentName) departmentSet.add(detail.departmentName);
      if (detail.eventName) eventSet.add(detail.eventName);
    }

    this.availableStatuses = Array.from(statusSet).sort((a, b) => a.localeCompare(b));
    this.availableDepartments = Array.from(departmentSet).sort((a, b) => a.localeCompare(b));
    this.availableEvents = Array.from(eventSet).sort((a, b) => a.localeCompare(b));

    console.log('Available Statuses:', this.availableStatuses);
    console.log('Available Departments:', this.availableDepartments);
    console.log('Available Events:', this.availableEvents);
  }

  clear(): void {
    this.filterStatus = '';
    this.filterDepartmentName = '';
    this.filterEventName = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.loadRequests(); 
  }

  // Method to refresh the main view filter when filters change
  onFilterChange(): void {
    this.loadRequests();
  }

  navigateToNewRequirement(): void {
    const url = `/dashboard/lc/${this.lcUserId}/create`;
    globalThis.location.href = url;
  }

}