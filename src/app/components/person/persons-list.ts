import { Component } from '@angular/core';
import { ConfigInputModel, Person } from './model';
import { PersonService } from './service/person.service';

@Component({
  selector: 'app-employees-output-form',
  templateUrl: './persons-list.html'
})

export class PersonsList {
  openFormFlag: boolean = false;
  deletePersonFlag = false;
  personIdForDelete!: number;
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

  constructor(private personService: PersonService) {
    this.getPerson();
  }
  getPerson(): void {
    let subscription = this.personService.getPerson().subscribe((person: any) => {
      this.persons = person;
      subscription.unsubscribe();
    });
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
      lastName: currentPerson.lastName
    };
    this.creatingSettings( 'Редактирование сотрудника');
    this.openFormFlag = true;
  }

  creatingSettings(formTitle: string): void {
    this.configForInput['addOrEdit'][0].value = this.currentPerson.firstName;
    this.configForInput['addOrEdit'][1].value = this.currentPerson.lastName;
    this.formTitle = formTitle
  }

  deletePerson(result: boolean) {
    if (result) {
      let subscription = this.personService.deletePerson(this.personIdForDelete)
        .subscribe( () => {
          this.getPerson();
          subscription.unsubscribe();
        });
    }
    this.deletePersonFlag = false;
  }

  updateData(event: any): void {
    console.log(event);
    if (event === undefined) {
      this.openFormFlag = false;
      return;
    }
    if (this.persons.length === 0 || this.persons[this.persons.length - 1].id < event.id) {
      let subscription = this.personService.setPerson(event).subscribe((person: any) => {
        this.persons.push(person);
        subscription.unsubscribe();
      });
    } else {
      for (let i = 0; i < this.persons.length; i++) {
        if (this.persons[i].id === event.id) {
          let subscription = this.personService.updatePerson(event.id, event)
            .subscribe((person: any) => {
                this.persons[i] = person;
                subscription.unsubscribe();
              });
        }
      }
    }
    this.openFormFlag = false;
  }
}
