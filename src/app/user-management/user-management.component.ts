import {Component, OnInit} from '@angular/core';
import {User} from '../shared/user.model';
import {UserService} from '../user/shared/user.service';
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public users: Array<User>;

  constructor(private userService: UserService, private flashMessageService: FlashMessagesService) {
  }

  ngOnInit(): void {
    this.userService.getAll()
      .subscribe(
        users => {
          this.users = users;
        },
        error => {
          this.flashMessageService.show(
            'Something went wrong. Please refresh page.',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            }
          );
        }
      );
  //  TODO: develop disable user and test edit user
  }

}
