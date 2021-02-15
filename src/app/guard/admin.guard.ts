import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  public canActivate(): boolean {
    if (this.authService.userSignedIn() && this.authService.getIsAdmin()) {
      return true;
    } else {
      this.router.navigate(['/not-authorized'])
        .then(r => {
          return false;
        });
    }
  }
}
