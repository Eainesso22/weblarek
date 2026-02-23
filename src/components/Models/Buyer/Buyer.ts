import { IBuyer } from "../../../types";
import { ApiService } from "../../base/ApiService";
import { IEvents } from "../../base/Events";

export class Buyer {
    private data: Partial<IBuyer> = {}; // Объект, где хранятся данные покупателя. Partial — значит, что поля могут быть пустыми

    constructor(private events: IEvents) {}

    setData(data: Partial<IBuyer>): void { // Метод сохранения данных покупателя
        this.data = { ...this.data, ...data }; // Объединяем новые данные с уже существующими, чтобы не терять предыдущие
        this.events.emit('buyer: updated', { buyer: this.data}) //изменение данных покупателя
        this.validate();

    }

    getData(): Partial<IBuyer> { // Метод получения всех данных покупателя
        return this.data;
    }

    clear(): void {  // Метод очистки данных покупателя
        this.data = {};
        this.events.emit('buyer: cleared');
        this.validate();
    }

    validate(): Record<string, string> {  // Метод валидации данных покупателя
        const errors: Record<string, string> = {}; // Объект для хранения ошибок
     
    if ("payment" in this.data && !this.data.payment) errors.payment = "Не выбран вид оплаты";
    if ("email" in this.data && !this.data.email) errors.email = "Укажите email";
    else if ("email" in this.data && this.data.email && !this.data.email.includes("@"))
      errors.email = "Неверный email";

    if ("phone" in this.data && !this.data.phone) errors.phone = "Укажите телефон";
    else if ("phone" in this.data && this.data.phone && !this.data.phone.match(/^\+?\d{10,15}$/))
      errors.phone = "Неверный телефон";

    if ("address" in this.data && !this.data.address) errors.address = "Укажите адрес";

    this.events.emit("buyer:validated", { errors });
    return errors;
  }
}



