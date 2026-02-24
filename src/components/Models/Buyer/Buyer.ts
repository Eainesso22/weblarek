import { IBuyer } from "../../../types";
import { ApiService } from "../../ApiService";
import { IEvents } from "../../base/Events";

export class Buyer {
    private data: Partial<IBuyer> = {}; // Объект, где хранятся данные покупателя. Partial — значит, что поля могут быть пустыми

    constructor(private events: IEvents) {}

    setData(data: Partial<IBuyer>): void { // Метод сохранения данных покупателя
        this.data = { ...this.data, ...data }; // Объединяем новые данные с уже существующими, чтобы не терять предыдущие
        this.events.emit('buyer: updated', { buyer: this.data}) //изменение данных покупателя
        const errors = this.validate();
        this.events.emit('buyer:validated', { errors });

    }

    getData(): Partial<IBuyer> { // Метод получения всех данных покупателя
        return this.data;
    }

    clear(): void {  // Метод очистки данных покупателя
        this.data = {};
        this.events.emit('buyer: cleared');
        const errors = this.validate();
        this.events.emit('buyer:validated', { errors });
    }

    validate(): Record<string, string> {  // Метод валидации данных покупателя
        const errors: Record<string, string> = {}; // Объект для хранения ошибок
        
        if (!this.data.payment) errors.payment = "Не выбран вид оплаты";
        if (!this.data.email) errors.email = "Укажите email";
        if (!this.data.phone) errors.phone = "Укажите телефон";
        if (!this.data.address) errors.address = "Укажите адрес";

        return errors;
        }

  }




