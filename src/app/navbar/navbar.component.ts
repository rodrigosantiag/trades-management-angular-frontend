import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  public signOutUser() {
    this.authService.signOut()
      .subscribe(
        () => this.router.navigate(['/sign-in'])
      );
  }

  ngOnInit() {
  }

}
