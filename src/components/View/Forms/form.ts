import { ensureAllElements } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";



// Класс Form<T> — базовый функционал для всех форм
 
export interface IFormData {
    [key: string]: string;   
}


export class Form<T extends IFormData> {
protected container: HTMLFormElement;
protected fields: Record<keyof T, HTMLInputElement>;
protected submitButton: HTMLButtonElement;
protected errorContainer: HTMLElement;
protected isValid = false;

constructor(container: HTMLFormElement) { // Конструктор принимает корневой элемент формы
    this.container = container;

    this.fields = Array.from(container.querySelectorAll<HTMLInputElement>('input'))
    .reduce((acc, input) => {
        acc[input.name as keyof T] = input;
        return acc;
    }, {} as Record<keyof T, HTMLInputElement>)

    this.submitButton = container.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    this.errorContainer = container.querySelector<HTMLElement>('.form__errors')!;
    }

   setFieldValue(name: keyof T, value: string): void {   // Устанавливаем значение поля по имени
        const field = this.fields[name];
        if (field) {
            field.value = value;
        }
    }
    getFieldValue(name: keyof T): string {        // Получаем текущее значение поля по имени
        return this.fields[name]?.value ?? ''; 
    }

    setError(message: string): void {
        this.errorContainer.textContent = message; 
    }

    clearError(): void {
        this.errorContainer.textContent = '';
    }
    
    set valid(value: boolean) {    // управляет состоянием кнопки отправки
        this.isValid = value;
        if (this.submitButton) {
            this.submitButton.disabled = !value;
}
}

onSubmit(handler: (formData: T) => void): void {
    this.container.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {} as T;   // Собираем данные всех полей в объект
        for (const key in this.fields) {
            formData[key as keyof T] = this.fields[key as keyof T].value as T[keyof T];
        }

        handler(formData);
    })
}
}