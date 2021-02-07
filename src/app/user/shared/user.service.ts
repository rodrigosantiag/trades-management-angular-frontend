import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AngularTokenService} from 'angular-token';
import {ErrorUtils} from '../../shared/error.utils';
import {Observable} from 'rxjs';
import {User} from '../../shared/user.model';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userUrl = this.tokenService.apiBase + '/users';

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService, private errorUtils: ErrorUtils) {
  }

  getAll(): Observable<User[]> {
    const url = `${this.userUrl}`;

    return this.httpClient.get(url)
      .pipe(
        map(response => this.responseToUsers(response)),
        catchError(this.errorUtils.handleErrors)
      );
  }

  getUser(id: string): Observable<User> {
    const url = `${this.userUrl}/${id}`;

    return this.httpClient.get(url)
      .pipe(
        map(response => this.responseToUser(response)),
        catchError(this.errorUtils.handleErrors)
      );
  }

  update(user: User): Observable<User> {
    const url = `${this.userUrl}/${user.id}`;

    return this.httpClient.put(url, user)
      .pipe(
        map(response => this.responseToUser(response)),
        catchError(this.errorUtils.handleErrors)
      );
  }

  private responseToUser(response: any): User {
    return new User(
      response.data.attributes.email,
      response.data.attributes.name,
      null,
      null,
      response.data.attributes.risk,
      response.data.id
    );
  }

  private responseToUsers(response: any): Array<User> {
    const usersArray = response.data;
    const users: User[] = [];

    usersArray.forEach(item => {
      const user = new User(
        item.attributes.email,
        item.attributes.name,
        null,
        null,
        item.attributes.risk,
        item.id
      );

      users.push(user)
    });
    return users;
  }


}
