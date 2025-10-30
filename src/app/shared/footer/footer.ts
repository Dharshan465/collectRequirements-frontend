import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
 scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top of the page
  }
}
