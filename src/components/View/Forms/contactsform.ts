import { Form, IFormData } from "./form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  setValidationErrors(errors: Record<string, string>) {
    throw new Error("Method not implemented.");
  }
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, private events: IEvents) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    )!;
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    )!;
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    )!;

    // При изменении поля отправляем событие только с изменённым полем
    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:fieldChanged", {
        field: "email",
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:fieldChanged", {
        field: "phone",
        value: this.phoneInput.value,
      });
    });

    // Начальное состояние кнопки (базовый класс при необходимости обновит её через valid)
    this.submitButton.disabled = true;
  }

  // Метод onSubmit больше не собирает данные – все данные уже в модели
  public onSubmit() {
    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("contacts:submit");
    });
  }
}