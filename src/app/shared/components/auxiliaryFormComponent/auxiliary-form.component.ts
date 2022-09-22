import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigInputModel, Person } from '../../../components/person/model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auxiliary-form',
  templateUrl: './auxiliary-form.component.html'
})

export class AuxiliaryFormComponent implements OnInit{
  @Input() configForInput: ConfigInputModel[] = [];
  @Input() currentPerson!: Person;
  @Input() title: string = 'Форма';
  @Output() newData: EventEmitter<Person> = new EventEmitter();
  formSent = false;
  form = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.currentPerson.firstName != '' && this.currentPerson.lastName != '') {
      this.form.get('firstName')!.setValue(this.currentPerson.firstName)
      this.form.get('lastName')!.setValue(this.currentPerson.lastName)
    }
  }

  save(): void {
    if (this.form.valid) {
      this.currentPerson.firstName = String(this.form.get('firstName')!.value);
      this.currentPerson.lastName = String(this.form.get('lastName')!.value);
      this.newData.emit(this.currentPerson);
    }
    this.formSent = true;
  }

  back(): void {
    this.formSent = true;
    this.newData.emit(undefined);
  }

  onlyLetters(value: any): void {
    value.setValue(value.value.replace(/[^a-zа-яё\\s]/gi, ''));
  }

  validation(control: any): boolean {
    return !control.valid && this.formSent;
  }
}
