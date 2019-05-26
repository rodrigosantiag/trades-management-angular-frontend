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

// FontAwesome
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {AuthGuard} from './guard/auth.guard';
import {BrokerService} from './brokers/shared/broker.service';
import {NotAuthenticatedGuard} from './guard/not-authenticated.guard';
import {AuthService} from './shared/auth.service';
import { BrokerDetailComponent } from './brokers/broker-detail/broker-detail.component';

library.add(fas, far, fab);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    SignUpFormComponent,
    SignInComponent,
    BrokersComponent,
    BrokerDetailComponent
  ],
  imports: [
    AngularTokenModule.forRoot({
      apiBase: 'http://api.binaryoptionsmanagement.local:3000',
      registerAccountCallback: window.location.origin + '/sign-in'
    }),
    AppRoutingModule,
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    BrokerService,
    AngularTokenModule,
    NotAuthenticatedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
