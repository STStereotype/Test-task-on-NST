import { Component } from '@angular/core';
import { ConfigInputModel, Person } from './model';
import { PersonService } from './service/person.service';
import { ToastService } from '../../shared/service';
import { TypeMessageModel } from '../../shared/service/toast/enum/type-message.model';
import { concat, first, map, Observable } from 'rxjs';

@Component({
  selector: 'app-employees-output-form',
  templateUrl: './persons-list.component.html',
})

export class PersonsListComponent {

  openFormFlag: boolean = false;

  noDate: boolean = false;

  deletePersonFlag: boolean = false;

  personIdForDelete!: number;

  currentPerson!: Person;

  configForInput: { [key:string]: ConfigInputModel[] } = {
    'addOrEdit': [
      {
        type: 'text',
        value: '',
        placeholder: 'Введите имя сотрудника',
      },
      {
        type: 'text',
        value: '',
        placeholder: 'Введите Фамилию сотрудника',
      },
    ],
  };

  formTitle = '';

  persons: Array<Person> = [];

  constructor(private personService: PersonService, private toastService: ToastService) {
    this.getPerson().subscribe();
  }

  getPerson(): Observable<void> {
    return this.personService.getPerson()
      .pipe(
        first(),
        map( (person: Person | object) => {
          this.persons = <Person[]>person;
          if (this.persons === null || this.persons.length === 0) {
            this.noDate = true;
          }
        }),
      );
  }

  addPerson(): void {
    let newId = 1;
    if (this.persons.length !== 0) {
      newId = this.persons[this.persons.length - 1].id + 1;
    }
    this.currentPerson = { id: newId, firstName: '', lastName: '' };
    this.creatingSettings('Создание сотрудника');
    this.openFormFlag = true;
  }

  changePerson(id: number): void {
    let currentPerson = this.persons[id];
    this.currentPerson = {
      id: currentPerson.id,
      firstName: currentPerson.firstName,
      lastName: currentPerson.lastName,
    };
    this.creatingSettings( 'Редактирование сотрудника');
    this.openFormFlag = true;
  }

  creatingSettings(formTitle: string): void {
    this.configForInput['addOrEdit'][0].value = this.currentPerson.firstName;
    this.configForInput['addOrEdit'][1].value = this.currentPerson.lastName;
    this.formTitle = formTitle;
  }

  deletePerson(result: boolean) {
    if (result) {
      let deletePerson = this.personService.deletePerson(this.personIdForDelete)
        .pipe(
          first(),
          map(()=> {
            this.toastService.createToastMessage('Сотрудник успешно удален', TypeMessageModel.access);
          }));
      concat(deletePerson, this.getPerson()).subscribe();
    }
    this.deletePersonFlag = false;
  }

  updateData(event: any): void {
    if (event === undefined) {
      this.openFormFlag = false;
      return;
    }
    let observable: Observable<void>;
    if (this.persons.length === 0 || this.persons[this.persons.length - 1].id < event.id) {
      observable = this.personService.setPerson(event)
        .pipe(
          first(),
          map(() => {
            this.toastService.createToastMessage('Сотрудник успешно добавлен', TypeMessageModel.access);
          }));
    } else {
      observable = this.personService.updatePerson(event.id, event)
        .pipe(
          first(),
          map(() => {
            this.toastService.createToastMessage('Данные успешно изменены', TypeMessageModel.access);
          }));
    }
    concat(observable, this.getPerson()).subscribe();
    this.openFormFlag = false;
    this.noDate = false;
  }
}
