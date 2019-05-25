import {Component, OnInit} from '@angular/core';
import {Broker} from './shared/broker.model';
import {BrokerService} from './shared/broker.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';

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
  public formErrors: Array<string>;
  public submitted: boolean;

  public constructor(
    private brokerService: BrokerService,
    private formBuilder: FormBuilder) {
    this.setUpForm();
    this.formUtils = new FormUtils(this.form);
    this.newBroker = new Broker(null, '');
    this.formErrors = null;
    this.submitted = false;
  }

  ngOnInit() {
    this.brokerService.getAll()
      .subscribe(
        brokers => {
          console.log(brokers);
          this.brokers = brokers;
        },
        error => {
          console.log(error);
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
          this.formErrors = null;
          this.brokers.unshift(broker);
          this.brokers.sort((a, b) => a.name.localeCompare(b.name));
          this.newBroker = new Broker(null, '');
          this.form.reset();
          this.submitted = false;
        },
        error => {
          console.log(error);
          if (error.status === 422) {
            this.formErrors = ['Broker name can\'t be blank'];
          } else {
            this.formErrors = ['An error ocurred. Try again later.'];
          }
          this.submitted = false;
        }
      );
  }

}
