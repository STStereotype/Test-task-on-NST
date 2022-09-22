import { Component } from '@angular/core';
import { ConfigInputModel, Person } from "./model";

@Component({
  selector: 'app-employees-output-form',
  templateUrl: './persons-list.html'
})

export class PersonsList {
  openForm: boolean = false;
  currentPerson!: Person;
  configForInput: { [key:string]: ConfigInputModel[] } = {
    'addOrEdit': [
      {
        type: 'text',
        value: '',
        placeholder: 'Введите имя сотрудника'
      },
      {
        type: 'text',
        value: '',
        placeholder: 'Введите Фамилию сотрудника'
      }
    ],
  };
  formTitle = '';
  persons: Array<Person> = [];

  addPerson(): void {
    let newId = 1;
    if (this.persons.length !== 0) {
      newId = this.persons[this.persons.length - 1].id + 1;
    }
    this.currentPerson = { id: newId, firstName: '', lastName: '' };
    this.creatingSettings('Создание сотрудника');
    this.openForm = true;
  }

  editPerson(id: number): void {
    let currentPerson = this.persons[id];
    this.currentPerson = {
      id: currentPerson.id,
      firstName: currentPerson.firstName,
      lastName: currentPerson.lastName
    };
    this.creatingSettings( 'Редактирование сотрудника');
    this.openForm = true;
  }

  creatingSettings(formTitle: string): void {
    this.configForInput['addOrEdit'][0].value = this.currentPerson.firstName;
    this.configForInput['addOrEdit'][1].value = this.currentPerson.lastName;
    this.formTitle = formTitle
  }

  deletePerson(id: number): void {
    this.persons.splice(id, 1);
  }

  updateData(event: any): void {
    if (event === undefined) {
      this.openForm = false;
      return;
    }
    if (this.persons.length === 0 || this.persons[this.persons.length - 1].id < event.id) {
      this.persons.push(event);
    } else {
      for (let i = 0; i < this.persons.length; i++) {
        if (this.persons[i].id === event.id) {
          this.persons[i] = event;
        }
      }
    }
    this.openForm = false;
  }
}
