import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Person } from '../model';
import { ToastService } from '../../../shared/service';
import { TypeMessageModel } from '../../../shared/service/toast/enum/type-message.model';

const httpOptions = {
  headers: new HttpHeaders( { 'content-type': 'application/json' }),
};

@Injectable()
export class PersonService {
  url: string = 'http://localhost:3001/api/v1';

  constructor(private http: HttpClient, private toast: ToastService) {}

  getPerson() {
    return this.http.get(`${this.url}/persons`)
      .pipe(
        catchError(error => {
          this.toast.createToastMessage('Ошибка загрузки данных', TypeMessageModel.error);
          return throwError(error);
        }),
      );
  }

  setPerson(newPerson: Person) {
    return this.http.post(`${this.url}/person`, newPerson)
      .pipe(
        catchError(error => {
          this.toast.createToastMessage('Ошибка загрузки данных на сервер', TypeMessageModel.error);
          return throwError(error);
        }),
      );
  }

  updatePerson(id: number, person: Person) {
    return this.http.put(`${this.url}/person/${id}`, person, httpOptions)
      .pipe(
        catchError(error => {
          this.toast.createToastMessage('Ошибка обновления данных', TypeMessageModel.error);
          return throwError(error);
        }),
      );
  }

  deletePerson(id: number) {
    return this.http.delete(`${this.url}/person/${id}`)
      .pipe(
        catchError(error => {
          this.toast.createToastMessage('Ошибка удаления данных', TypeMessageModel.error);
          return throwError(error);
        }),
      );
  }
}
