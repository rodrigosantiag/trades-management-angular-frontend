import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignUpFormComponent} from './sign-up-form/sign-up-form.component';
import {SignInComponent} from './sign-in/sign-in.component';

const routes: Routes = [
  {path: 'sign-up', component: SignUpFormComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: '', component: SignInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
