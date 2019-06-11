import {HttpResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ErrorUtils {

  public constructor() {
  }


  public handleErrors(response: HttpResponse<any>) {
    return throwError(response);
  }
}
