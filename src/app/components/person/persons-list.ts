import { Component, OnInit } from '@angular/core';
import { ConfigInputModel, Person } from './model';
import { PersonService } from './service/person.service';
import { ToastService } from '../../shared/service';
import { TypeMessageModel } from '../../shared/service/toast/enum/type-message.model';

@Component({
  selector: 'app-employees-output-form',
  templateUrl: './persons-list.html'
})

export class PersonsList implements OnInit{
  configToast = {
    typeMessage: {
      access: false,
      warning: false,
      error: false
    },
    textMessage: ''
  }
  openFormFlag: boolean = false;
  noDate = false;
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

  constructor(private personService: PersonService, private toastService: ToastService) {
    this.getPerson();
  }

  ngOnInit() {
    setInterval(() => {
    }, 1000)
  }

  getPerson(): void {
    let subscription = this.personService.getPerson().pipe()
      .subscribe((person: any) => {
      this.persons = person;
      if (this.persons === null || this.persons.length === 0) {
        this.noDate = true;
      }
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
          this.toastService.createToastMessage('Сотрудник успешно удален', TypeMessageModel.access);
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
        this.toastService.createToastMessage('Сотрудник успешно добавлен', TypeMessageModel.access);
        subscription.unsubscribe();
      });
    } else {
      for (let i = 0; i < this.persons.length; i++) {
        if (this.persons[i].id === event.id) {
          let subscription = this.personService.updatePerson(event.id, event)
            .subscribe((person: any) => {
                this.persons[i] = person;
              this.toastService.createToastMessage('Данные успешно изменены', TypeMessageModel.access);
              subscription.unsubscribe();
              });
        }
      }
    }
    this.openFormFlag = false;
    this.noDate = false;
  }
  closeToast(): void {
    this.configToast.typeMessage.access = false;
    this.configToast.typeMessage.warning = false;
    this.configToast.typeMessage.error = false;
    this.configToast.textMessage = '';
  }
}
