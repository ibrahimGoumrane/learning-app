import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  user = signal<any>(null);

  constructor(private clerk: ClerkService) {}

  ngOnInit() {
    this.clerk.user$.subscribe((user) => {
      this.user.set(user);
    });
  }
}
