import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ClerkService, ClerkUserButtonComponent } from 'ngx-clerk';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive , ClerkUserButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // Signal to track the state of the mobile menu (open/closed)
  protected readonly isMobileMenuOpen = signal(false);
  protected readonly title = signal('learning-app');
  protected readonly user = signal<any>(null);

  constructor(private _clerk: ClerkService) {
    this._clerk.__init({
      publishableKey: 'pk_test_ZGVjZW50LWNoZWV0YWgtNzQuY2xlcmsuYWNjb3VudHMuZGV2JA',
    });
  }

  ngOnInit() {
    this._clerk.user$.subscribe((user) => {
      this.user.set(user);
    });
  }

  // Method to toggle the mobile menu
  toggleMobileMenu() {
    this.isMobileMenuOpen.update((value) => !value);
  }
}
