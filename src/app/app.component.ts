import {Component} from '@angular/core';
import {AuthService} from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Binary Financial Management System';
  public signedIn?: boolean;

  public constructor(private authService: AuthService) {

  }

  public userSignedIn(): boolean {
    return this.authService.userSignedIn();
  }

}
