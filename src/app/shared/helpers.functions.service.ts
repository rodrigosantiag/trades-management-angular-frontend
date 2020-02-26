import { Injectable } from '@angular/core';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HelpersFunctionsService {

  constructor(private location: Location) { }

  public goBack(): void {
    this.location.back();
  }

}
