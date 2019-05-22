import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignUpFormComponent} from './sign-up-form/sign-up-form.component';

const routes: Routes = [
  {path: 'sign-up', component: SignUpFormComponent},
  {path: '', component: SignUpFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
