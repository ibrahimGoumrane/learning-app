import { Routes } from '@angular/router';
import { ClerkAuthGuardService } from 'ngx-clerk';
import { Home } from './features/home/home';
import { Upload } from './features/upload/upload';
import { EvaluationResult } from './features/evaluation-result/evaluation-result';
import { SignUp } from './pages/sign-up/sign-up';
import { SignIn } from './pages/sign-in/sign-in';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'user/sign-up', component: SignUp },
  { path: 'user/sign-in', component: SignIn },
  { path: 'upload', component: Upload, canActivate: [ClerkAuthGuardService] },
  { path: 'results', component: EvaluationResult, canActivate: [ClerkAuthGuardService] },
  { path: '**', redirectTo: '' },
];
