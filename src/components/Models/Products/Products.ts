import { IProduct } from "../../../types";

export class Products {
    private items: IProduct[] = []; // Массив всех товаров, изначально пустой
    
    private selectedItem: IProduct | null = null; // Товар, выбранный для подробного отображения, изначально null

    constructor() {}

    setItems(items: IProduct[]) : void {  // Метод для сохранения массива товаров в модели
        this.items = items; // Переписываем внутреннее поле items новым массивом товаров
    }

    getItems(): IProduct[] { // Метод для получения всех товаров из модели
        return this.items; // Возвращаем массив товаров
    }

    getItemById(id: string): IProduct | undefined { // Метод для поиска товара по его id
        return this.items.find(item => item.id === id); // Используем метод массива find для поиска товара
    }

    setSelectedItem(item: IProduct): void { // Метод для сохранения выбранного товара для подробного отображения
        this.selectedItem = item; // Сохраняем товар в поле selectedItem
    }

    getSelectedItem(): IProduct| null { // Метод для получения выбранного товара
        return this.selectedItem; // Возвращаем товар, выбранный для подробного отображения
    }
}