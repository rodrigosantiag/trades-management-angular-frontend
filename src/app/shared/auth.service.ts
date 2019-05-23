import { Injectable } from '@angular/core';
import {AngularTokenService} from 'angular-token';
import {UserModel} from './user.model';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private tokenService: AngularTokenService) { }

  public signUp(user: UserModel): Observable<HttpResponse<any>> {
    user.risk = +user.risk
    return this.tokenService.registerAccount(user as any)
      .pipe(catchError(this.handleErrors));
  }

  public handleErrors(error: HttpResponse<any>) {
    return throwError(error);
  }
}
