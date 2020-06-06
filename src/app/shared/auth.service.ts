import {Injectable} from '@angular/core';
import {AngularTokenService, SignInData, UserData} from 'angular-token';
import {User} from './user.model';
import {Observable, pipe, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private tokenService: AngularTokenService) {
  }

  public signUp(user: User): Observable<HttpResponse<any>> {
    return this.tokenService.registerAccount(user as any)
      .pipe(catchError(this.handleErrors));
  }

  public signIn(uid: string, password: string): Observable<HttpResponse<any>> {
    const signInData: SignInData = {
      login: uid,
      password
    };

    return this.tokenService.signIn(signInData)
      .pipe(catchError(this.handleErrors));
  }

  public signOut(): Observable<HttpResponse<any>> {
    return this.tokenService.signOut()
      .pipe(catchError(this.handleErrors));
  }

  public forgotPassWord(email: string): Observable<HttpResponse<any>> {
    return this.tokenService.resetPassword({login: email})
      .pipe(catchError(this.handleErrors));
  }

  public handleErrors(error: HttpResponse<any>) {
    return throwError(error);
  }

  public userSignedIn(): boolean {
    return this.tokenService.userSignedIn();
  }

  public getUserName(): string {
    return localStorage.getItem('userName');
  }

  public setUserName(username: string): void {
    localStorage.setItem('userName', username);
  }

  public getUserId(): string {
    return localStorage.getItem('userId');
  }
}
