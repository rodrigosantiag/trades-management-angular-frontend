import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorUtils} from '../../shared/error.utils';
import {AngularTokenService} from 'angular-token';
import {ResetPasswordModel} from './reset-password.model';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  public resetPasswordUrl = this.tokenService.apiBase + '/reset_password';

  constructor(private httpClient: HttpClient, private tokenService: AngularTokenService, private errorUtils: ErrorUtils) {
  }

  public resetPassword(resetPassword: ResetPasswordModel): Observable<any> {
    const url = `${this.resetPasswordUrl}/${resetPassword.resetPasswordToken}`;

    return this.httpClient.put(url, resetPassword)
      .pipe(
        catchError(this.errorUtils.handleErrors),
        map(() => null)
      );

  }
}
