import { Component } from '@angular/core';
import { ClerkSignUpComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sign-up',
  imports: [ClerkSignUpComponent],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {}
