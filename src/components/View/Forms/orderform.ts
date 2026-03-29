import { Form, IFormData } from "./form";
import { ensureElement } from "../../../utils/utils";
import { IContactsFormData } from "./contactsForm";
import { EventEmitter } from "../../base/Events";

export interface IOrderFormData extends IFormData {
  address: string;
  paymentMethod: "online" | "cash" | "";
}


export class OrderForm extends Form<IOrderFormData> {
  protected onlineButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  events: any;

  constructor(container: HTMLFormElement) {
    super(container);

    // Поиск элементов формы
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );
    this.onlineButton = ensureElement<HTMLButtonElement>(
      '.button[name="card"]',
      container
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      '.button[name="cash"]',
      container
    );

    // При клике на кнопку оплаты эмитим событие с выбранным методом
    this.onlineButton.addEventListener("click", () => {
      this.events.emit("payment:change", { method: "online" });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit("payment:change", { method: "cash" });
    });

    // При вводе адреса эмитим событие с новым значением
    this.addressInput.addEventListener("input", () => {
      this.events.emit("address:change", { value: this.addressInput.value });
    });
  }

  set paymentMethod(method: "online" | "cash" | "") {
    // Визуальное выделение выбранного способа
    this.onlineButton.classList.toggle("button_alt-active", method === "online");
    this.cashButton.classList.toggle("button_alt-active", method === "cash");

    // Сохраняем значение в данных формы (через базовый класс)
    super.setFieldValue("paymentMethod", method);
  }

  setFieldValue(name: keyof IOrderFormData, value: string): void {
    if (name === "paymentMethod") {
      this.paymentMethod = value as "online" | "cash" | "";
    } else {
      super.setFieldValue(name, value);
    }
  }
}

export function validateContactsForm(formData: IContactsFormData, events: EventEmitter) {
  const errors: Record<string, string> = {};

  if (!formData.email.includes("@")) {
    errors.email = "Неверный email";
  }

  if (!formData.phone.match(/^\+?\d{10,15}$/)) {
    errors.phone = "Неверный телефон";
  }

  events.emit("buyer:validated", { errors });

  return errors;
}