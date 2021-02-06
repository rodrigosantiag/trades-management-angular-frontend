import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  public userSignedIn(): boolean {
    return this.authService.userSignedIn();
  }

  public isAdmin?(): boolean {
    return this.authService.getIsAdmin();
  }

  ngOnInit() {
  }

}
