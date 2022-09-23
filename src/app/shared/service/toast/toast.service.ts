import { Injectable, Input } from '@angular/core';
import { TypeMessageModel } from './enum/type-message.model';

@Injectable()
export class ToastService {
  private elements: Array<string> = [];
  lastElement = 'toast_0';
  @Input() typeMessage: TypeMessageModel = TypeMessageModel.access;

  createToastMessage(
    message: string,
    typeMessage: TypeMessageModel = this.typeMessage) {
    const htmlElement = document.body;
    let launchElement = this.lastElement;
    if (this.elements.length > 0) {
      launchElement = `toast_${Number(this.lastElement.replace('toast_', '')) + 1}`;
      this.lastElement = launchElement;
    }
    this.elements.push(launchElement);

    htmlElement.insertAdjacentHTML('afterbegin',
      `<div id="${launchElement}" style="top: -61px; opacity: 1; right: 25px;" class="toast_wrapper"><div class="${typeMessage}" >${message}</div></div>`);

    let topElement =  document.getElementById(`${launchElement}`);
    topElement!.style.top = `${Number(topElement!.style.top.replace('px', '')) + topElement!.clientHeight + 45}px`;
    if (this.elements.length > 1) {
      for (let i = this.elements.length - 1; i > 0; i--) {
        let topElement =  document.getElementById(`${this.elements[i]}`);
        let currentElement =  document.getElementById(`${this.elements[i - 1]}`);
        currentElement!.style.top = `${Number(topElement!.style.top.replace('px', '')) + topElement!.clientHeight + 15}px`;
      }
    }
    setTimeout(() => {
      let element = document.getElementById(launchElement);
      element!.style.opacity = '0';
      element!.style.right = `-${element!.clientWidth}px`;
      setTimeout(() => {
        this.elements.splice(0, 1);
        element!.remove();
      }, 400)
    }, 3000)
  }
}
