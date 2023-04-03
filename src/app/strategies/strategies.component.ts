import {Component, OnInit, Renderer2} from '@angular/core';
import {Strategy} from './shared/strategy.model';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form.utils';
import {StrategyService} from './shared/strategy.service';
import {FlashMessagesService} from 'angular2-flash-messages';


@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css']
})
export class StrategiesComponent implements OnInit {
  public strategies: Array<Strategy>;
  public form: UntypedFormGroup;
  public formUtils: FormUtils;
  public newStrategy: Strategy;
  public messages: Array<string>;
  public submitted: boolean;
  public editingStrategy: Strategy;
  public formEdit: UntypedFormGroup;

  constructor(
    private strategyService: StrategyService,
    private formBuilder: UntypedFormBuilder,
    private flashMessageService: FlashMessagesService,
    private renderer: Renderer2
  ) {
    this.setUpForm();
    this.formUtils = new FormUtils(this.form);
    this.newStrategy = new Strategy(null, null);
    this.messages = null;
    this.submitted = false;
    this.editingStrategy = new Strategy(null, null);
    this.formEdit = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.strategyService.getAll()
      .subscribe(
        strategies => {
          this.strategies = strategies;
        },
        () => {
          this.flashMessageService.show(
            'Something went wrong. Please refresh page.',
            {
              cssClass: 'alert-danger',
              timeout: 5000
            });
        }
      );
  }

  public createStrategy() {
    this.newStrategy.name = this.form.get('name').value.trim();
    this.submitted = true;

    this.strategyService.create(this.newStrategy)
      .subscribe(
        strategy => {
          this.strategies.unshift(strategy);
          this.strategies.sort((a, b) => a.name.localeCompare(b.name));
          this.newStrategy = new Strategy(null, null);
          this.form.reset();
          this.submitted = false;
          this.flashMessageService.show(
            `Strategy ${strategy.name} added!`,
            {
              cssClass: 'alert-success',
              timeout: 5000
            });
        },
        error => {
          if (error.status === 422) {
            this.messages = ['Strategy\'s name can\'t be blank'];
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

  public beginEdit(editingStrategy: Strategy) {
    this.editingStrategy = editingStrategy;
    this.formEdit.patchValue(editingStrategy);
    setTimeout(() => {
      const inputName = this.renderer.selectRootElement('.input-edit');
      inputName.focus();
    }, 300);
  }

  public updateStrategy(strategy: Strategy) {
    const oldName = strategy.name;
    strategy.name = this.formEdit.get('name').value.trim();
    this.submitted = true;

    return this.strategyService.update(strategy)
      .subscribe(
        response => {
          const itemIndex = this.strategies.findIndex(item => item.id === response.id);
          this.strategies[itemIndex] = response;
          this.strategies.sort((a, b) => a.name.localeCompare(b.name));
          this.editingStrategy = new Strategy(null, null);
          this.messages = [`Strategy '${strategy.name}' updated!`];
          this.flashMessageService.show(this.messages.join(' | '), {
            cssClass: 'alert-success',
            timeout: 5000
          });
          this.submitted = false;
        },
        error => {
          strategy.name = oldName;
          if (error.status === 422) {
            this.messages = ['Strategy\'s name can\'t be blank'];
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

  public deleteStrategy(strategy: Strategy) {
    if (confirm(`Confirm "${strategy.name}" strategy remove? This action is irreversible.`)) {
      this.strategyService.delete(strategy.id)
        .subscribe(
          () => {
            this.strategies = this.strategies.filter(s => s !== strategy);
            this.flashMessageService.show(`Strategy "${strategy.name}" removed!`, {
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

  public cancelEdit() {
    this.editingStrategy = new Strategy(null, null);
  }

  public isEditingThiStrategy?(strategy: Strategy) {
    return this.editingStrategy === strategy;
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
  }

}
