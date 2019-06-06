import {HttpResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

export class ErrorUtils {
  public handleErrors(response: HttpResponse<any>) {
    return throwError(response);
  }
}
