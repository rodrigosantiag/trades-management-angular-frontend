import {Component, OnInit, Renderer2} from '@angular/core';
import {Broker} from './shared/broker.model';
import {BrokerService} from './shared/broker.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {FlashMessagesService} from 'angular2-flash-messages';


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
          this.flashMessageService.show(
            'Something went wrong. Please refresh page.',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            }
          );
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
          this.flashMessageService.show(`Broker ${broker.name} added!`, {
            cssClass: 'alert-success',
            timeout: 5000
          });
        },
        error => {
          if (error.status === 422) {
            this.messages = ['Broker name can\'t be blank'];
          } else {
            this.messages = ['An error ocurred. Try again later.'];
          }
          this.submitted = false;
          this.flashMessageService.show(this.messages.join(' | '), {
            cssClass: 'alert-danger',
            timeout: 5000
          });
        }
      );
  }

  public deleteBroker(broker: Broker) {
    if (confirm(`Confirm ${broker.name} broker remove? This action is irreversible.`)) {
      this.brokerService.delete(broker.id)
        .subscribe(
          () => {
            this.brokers = this.brokers.filter(t => t !== broker);
            this.flashMessageService.show(`Broker ${broker.name} removed!`, {
              cssClass: 'alert-danger',
              timeout: 5000
            });
          },
          () => {
            this.flashMessageService.show('An error ocurred. Please try again later.', {
              cssClass: 'alert-danger',
              timeout: 5000
            });
          }
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
    const oldName = broker.name;
    broker.name = this.formEdit.get('name').value.trim();
    this.submitted = true;

    return this.brokerService.update(broker)
      .subscribe(
        (response) => {
          const itemIndex = this.brokers.findIndex(item => item.id === response.id);
          this.brokers[itemIndex] = response;
          this.brokers.sort((a, b) => a.name.localeCompare(b.name));
          this.editingBroker = new Broker(null, null);
          this.messages = [`Broker ${broker.name} updated!`];
          this.flashMessageService.show(this.messages.join(' | '), {
            cssClass: 'alert-success',
            timeout: 5000
          });
          this.submitted = false;
        },
        error => {
          broker.name = oldName;
          if (error.status === 422) {
            this.messages = ['Broker name can\'t be blank'];
          } else {
            this.messages = ['An error ocurred. Try again later.'];
          }
          this.flashMessageService.show(this.messages.join(' | '), {
            cssClass: 'alert-danger',
            timeout: 5000
          });
          this.submitted = false;
        }
      );
  }

  public isEditingThisBroker?(broker: Broker) {
    return this.editingBroker === broker;
  }
}
