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
import {NgFlashMessagesModule} from 'ng-flash-messages';
import {AccountsComponent} from './accounts/accounts.component';
import {ErrorUtils} from './shared/error.utils';
import {AccountDetailComponent} from './accounts/account-detail/account-detail.component';

library.add(fas, far, fab);

import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  declarations: [
    AccountsComponent,
    AccountDetailComponent,
    AppComponent,
    BrokersComponent,
    NavbarComponent,
    SidebarComponent,
    SignUpFormComponent,
    SignInComponent
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
    NgFlashMessagesModule.forRoot(),
    NgbModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    BrokerService,
    AngularTokenModule,
    ErrorUtils,
    NotAuthenticatedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
