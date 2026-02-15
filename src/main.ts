import "./scss/styles.scss";
import { Cart } from "./components/Models/Cart/Cart";
import { Buyer } from "./components/Models/Buyer/Buyer";
import { Products } from "./components/Models/Products/Products";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/base/ApiService";
import { API_URL } from "./utils/constants";

//  Проверка Products
const productsModel = new Products();

productsModel.setItems(apiProducts.items); // Сохраняем в модель товары из apiProducts

console.log("Каталог товаров", productsModel.getItems());

const firstProductId = apiProducts.items[2].id;
console.log("Получаем товары по id", productsModel.getItemById(firstProductId));

// Проверка Cart
const cart = new Cart();

cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
console.log("Добавили два товара", cart.getItems());

// Проверка метод hasItem
console.log("Проверка наличия товара", cart.hasItem(apiProducts.items[0].id));

// Считаем количество и общую сумму
console.log("Количество товаров", cart.getCount());
console.log("Общая сумма", cart.getTotalPrice());

// Удаляем один товар
cart.removeItem(apiProducts.items[0].id);
console.log("Удаление товара", cart.getItems());

// Очищаем корзину
cart.clear();
console.log("очищаем корзину", cart.getItems());

// Проверка Buyer
const buyer = new Buyer();

buyer.setData({ email: "test@example.com" });
console.log("Добавление email", buyer.getData());

//Проверка валидацию
console.log('ошибки валидации', buyer.validate());

buyer.setData({
    phone: '+79993332132',
    address: 'г.Тбилиси, ул. Элиз бар, д. 1',
    payment: 'card',
});
console.log('Заполнение полей', buyer.getData());

console.log('Проверка на ошибки валидации', buyer.validate());

// Очищаем данные покупателя
buyer.clear();
console.log('После очистки', buyer.getData());

// Проверка API 

// Создаём экземпляры Api и ApiService
const api = new Api( API_URL); // URL Postman
const apiService = new ApiService(api);

async function testApi() {
    // 1. Получение массива товаров с сервера
    try {
    const products = await apiService.getProducts();
    console.log("Каталог товаров (с сервера)", products);

    // 2. Сохраняем товары в модель
    productsModel.setItems(products);
    console.log("Каталог из модели после загрузки", productsModel.getItems());
    } catch (error) {
        if (error instanceof Error) {
            console.error("Ошибка при получении товаров:", error.message);
        } else {
            console.error("Неизвестная ошибка при получении товаров:", error)
        }
        return;
    }

    // 3. Отправка заказа (проверка postOrder)
    try {
        const items = productsModel.getItems();
        if (items.length < 2) {
            console.warn("Недостаточно товаров для тестового заказа — пропускаю отправку.")
            return; // не делаем запрос, если товаров малоп
        }
    
    const orderResponse = await apiService.postOrder({
        payment: "online",
        email: "test@test.ru",
        phone: "+71234567890",
        address: "Spb Vosstania 1",
        total: 2200,
        items: [items[0].id, items[1].id]
            
        
    });

    console.log("Ответ сервера на заказ", orderResponse);
} catch (error) {
    if (error instanceof Error) {
        console.error("Ошибка при отправке заказа:", error.message);
    } else {
        console.error("Неизвестная ошибка при отправке заказа:", error);
    }
}
}
testApi();

