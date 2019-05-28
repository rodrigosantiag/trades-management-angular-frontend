import {Injectable} from '@angular/core';
import {NgFlashMessageService} from 'ng-flash-messages';

@Injectable({
  providedIn: 'root'
})

export class FlashMessagesService {
  constructor(private flashMessageSerice: NgFlashMessageService) {
  }

  public buildFlashMessage(message: Array<string>, timeout: number | boolean, dismissible: boolean, type: string) {
    this.flashMessageSerice.showFlashMessage({
      messages: message,
      type,
      timeout,
      dismissible
    });
  }
}
