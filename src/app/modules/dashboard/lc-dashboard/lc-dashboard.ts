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
        this.requestDetails = data;
        this.populateFilterOptions(); 
      },
      error: (err) => console.error(`Error fetching requests for LC User ID: ${this.lcUserId}`, err)
    });
  }

  populateFilterOptions(): void {
    this.availableStatuses = [];
    this.availableDepartments = [];
    this.availableEvents = [];

    const statusSet = new Set<string>();
    const departmentSet = new Set<string>();
    const eventSet = new Set<string>();

    for (const detail of this.requestDetails) {
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

  navigateToNewRequirement(): void {
    const url = `/dashboard/lc/${this.lcUserId}/create`;
    window.location.href = url;
  }

}