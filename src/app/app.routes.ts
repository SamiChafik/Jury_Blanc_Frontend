import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Routes = [
  { path: 'announcement', component: AnnouncementListComponent, canActivate:[AuthGuard]},
  { path: 'requestlist', component: RequestListComponent, canActivate:[AuthGuard] },
  { path: 'users', component: UserListComponent, canActivate:[AuthGuard, AdminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
