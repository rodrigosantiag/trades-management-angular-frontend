import {AfterViewInit, Component, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {Broker} from './shared/broker.model';
import {BrokerService} from './shared/broker.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {FlashMessagesService} from '../shared/flashMessages.service';

@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.component.html',
  styleUrls: ['./brokers.component.css']
})
export class BrokersComponent implements OnInit {
  public brokers: Array<Broker>;
  public form: FormGroup;
  public formUtils: FormUtils;
  public newBroker: Broker;
  public messages: Array<string>;
  public submitted: boolean;
  public editingBroker: Broker;
  public formEdit: FormGroup;

  public constructor(
    private brokerService: BrokerService,
    private formBuilder: FormBuilder,
    private flashMessageService: FlashMessagesService,
    private renderer: Renderer2) {
    this.setUpForm();
    this.formUtils = new FormUtils(this.form);
    this.newBroker = new Broker(null, '');
    this.messages = null;
    this.submitted = false;
    this.editingBroker = new Broker(null, null);
    this.formEdit = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.brokerService.getAll()
      .subscribe(
        brokers => {
          this.brokers = brokers;
        },
        error => {
          alert('An error ocurred. Please try again');
        }
      );
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
  }

  public createBroker() {
    this.newBroker.name = this.form.get('name').value.trim();
    this.submitted = true;

    this.brokerService.create(this.newBroker)
      .subscribe(
        broker => {
          this.brokers.unshift(broker);
          this.brokers.sort((a, b) => a.name.localeCompare(b.name));
          this.newBroker = new Broker(null, '');
          this.form.reset();
          this.submitted = false;
          this.flashMessageService.buildFlashMessage([`Broker ${broker.name} added!`], 5000, true, 'success');
        },
        error => {
          if (error.status === 422) {
            this.messages = ['Broker name can\'t be blank'];
          } else {
            this.messages = ['An error ocurred. Try again later.'];
          }
          this.submitted = false;
          this.flashMessageService.buildFlashMessage(this.messages, false, true, 'danger');
        }
      );
  }

  public deleteBroker(broker: Broker) {
    if (confirm(`Confirm ${broker.name} broker remove? This action is irreversible.`)) {
      this.brokerService.delete(broker.id)
        .subscribe(
          () => {
            this.brokers = this.brokers.filter(t => t !== broker);
            this.flashMessageService.buildFlashMessage([`Broker ${broker.name} removed!`], 5000, true, 'danger');
          },
          () => alert('An error ocurred. Please try again.')
        );
    }
  }

  public beginEdit(editingBroker: Broker) {
    this.editingBroker = editingBroker;
    this.formEdit.patchValue(editingBroker);
    setTimeout(() => {
      const inputName = this.renderer.selectRootElement('.input-edit');
      inputName.focus();
    }, 300);
  }

  public cancelEdit() {
    this.editingBroker = new Broker(null, null);
  }

  public updateBroker(broker: Broker) {
    // TODO: continue to upgrade to angular 9
    // TODO: last step made on https://update.angular.io/#8.0:9.0:
    // TODO: "Run ng update @angular/core@8 @angular/cli@8 in your workspace directory to update to the latest 8.x version
    // TODO: of @angular/core and @angular/cli and commit these changes."
    broker.name = this.formEdit.get('name').value;

    return this.brokerService.update(broker)
      .subscribe(
        (response) => {
          const itemIndex = this.brokers.findIndex(item => item.id === response.id);
          this.brokers[itemIndex] = response;
          this.brokers.sort((a, b) => a.name.localeCompare(b.name));
          this.editingBroker = new Broker(null, null);
          this.messages = [`Broker ${broker.name} updated!`];
          this.flashMessageService.buildFlashMessage(this.messages, 5000, true, 'success');
        },
        () => {
          this.messages = ['Broker not updated! Please try again.'];
          this.flashMessageService.buildFlashMessage(this.messages, 5000, true, 'danger');
        }
      );
  }

  public isEditingThisBroker?(broker: Broker) {
    return this.editingBroker === broker;
  }
}
