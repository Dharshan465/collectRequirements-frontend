import { Component, ElementRef, Host, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header implements OnInit{

  //for now hardcoding username for both lc and lnd

  lcUsername: string = 'John Doe';
  ldUsername: string = 'Sarah Roberts';
  userName: string = '';

  showDropdown: boolean = false;

  constructor(private elementRef: ElementRef) {}

	ngOnInit(): void {
    if (this.isLDUser()) {
      this.userName = this.ldUsername;
    } else {
      this.userName = this.lcUsername;
    }
	}

  toggleDropdown(): void {
    console.log('Toggle dropdown called, current state:', this.showDropdown);
    this.showDropdown = !this.showDropdown;
    console.log('New dropdown state:', this.showDropdown);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) :void{
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }

  viewProfile(): void{
    console.log('View Profile clicked');
  }



	logout(): void{
    console.log('Logout clicked');
    alert('Logged out successfully!');
	}

  isLDUser(): boolean {
    return globalThis.location.href.includes('dashboard/ld');
  }

}