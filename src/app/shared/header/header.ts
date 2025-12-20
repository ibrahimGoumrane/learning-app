import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClerkService, ClerkUserButtonComponent } from 'ngx-clerk';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ClerkUserButtonComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  user = signal<any>(null);
  constructor(public clerk: ClerkService) {}
  ngOnInit() {
    this.clerk.user$.subscribe((user) => {
      this.user.set(user);
    });
  }
  logout() {
    console.log('Logging out...');
  }
}
