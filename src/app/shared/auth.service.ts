import {Injectable} from '@angular/core';
import {AngularTokenService, SignInData} from 'angular-token';
import {UserModel} from './user.model';
import {Observable, pipe, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private tokenService: AngularTokenService) {
  }

  public signUp(user: UserModel): Observable<HttpResponse<any>> {
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
}
