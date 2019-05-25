import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {AngularTokenModule} from 'angular-token';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {BrokersComponent} from './brokers/brokers.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpFormComponent} from './sign-up-form/sign-up-form.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    SignUpFormComponent,
    SignInComponent,
    BrokersComponent
  ],
  imports: [
    AngularTokenModule.forRoot({
      apiBase: 'http://api.binaryoptionsmanagement.local:3000',
      registerAccountCallback: window.location.origin + '/sign-in'
    }),
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [AngularTokenModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
