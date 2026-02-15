import { IProduct } from "../../../types";

export class Cart {
    private items: IProduct[] = [];

    constructor() {}

    getItems(): IProduct[] { // Метод получения массива товаров в корзине
        return this.items;
    }

    addItem(item: IProduct): void {  // Метод добавления товара в корзину
        if (!this.hasItem(item.id)) {
            this.items.push(item);
        }
    }

    removeItem(id: string): void { // Метод удаления товара из корзины по id
        this.items = this.items.filter(item => item.id !== id); // Фильтруем массив, исключая товар с указанным id
    }
    clear(): void { // Метод очистки всей корзины
        this.items = [];
    }
    getTotalPrice(): number { // Метод подсчёта общей стоимости товаров в корзине
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0); // Используем reduce, складывая цены всех товаров
    }

    getCount(): number { // Метод получения количества товаров в корзине
        return this.items.length;
    }
    hasItem(id: string): boolean { // Метод проверки, есть ли товар в корзине по id
        return this.items.some(item => item.id === id); // some вернёт true, если хотя бы один товар совпадает по id
    }
}
