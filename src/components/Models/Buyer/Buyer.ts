import { IBuyer } from "../../../types";

export class Buyer {
    private data: Partial<IBuyer> = {}; // Объект, где хранятся данные покупателя. Partial — значит, что поля могут быть пустыми

    constructor() {}

    setData(data: Partial<IBuyer>): void { // Метод сохранения данных покупателя
        this.data = { ...this.data, ...data }; // Объединяем новые данные с уже существующими, чтобы не терять предыдущие
    }

    getData(): Partial<IBuyer> { // Метод получения всех данных покупателя
        return this.data;
    }

    clear(): void {  // Метод очистки данных покупателя
        this.data = {};
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



