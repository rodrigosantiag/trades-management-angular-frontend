import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignUpFormComponent} from './sign-up-form/sign-up-form.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {NotAuthenticatedGuard} from './guard/not-authenticated.guard';
import {BrokersComponent} from './brokers/brokers.component';
import {AuthGuard} from './guard/auth.guard';

const routes: Routes = [
  {path: 'sign-up', component: SignUpFormComponent, canActivate: [NotAuthenticatedGuard]},
  {path: 'sign-in', component: SignInComponent, canActivate: [NotAuthenticatedGuard]},
  {path: 'brokers', component: BrokersComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/brokers', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
