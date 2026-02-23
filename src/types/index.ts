import { Api } from "../components/base/Api";
import { ApiService } from "../components/base/ApiService";
import { CardCatalog } from "../components/View/Сards/cardCatalog";
import { apiProducts } from "../utils/data";
import { cloneTemplate } from "../utils/utils";

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
 // Товар

export interface IProduct {
  id: string;           // уникальный идентификатор товара
  description: string;  // подробное описание товара
  image: string;        // ссылка на изображение товара
  title: string;        // название товара
  category: string;     // категория товара
  price: number | null; // цена товара, null если цена не задана
}

// Покупатель

export type TPayment = 'online' | 'cash'; // пример типов оплаты

export interface IBuyer {
  payment: TPayment;  // способ оплаты
  email: string;      // почта покупателя
  phone: string;      // телефон покупателя
  address: string;    // адрес доставки
}

// Слой коммуникации

export interface IProductResponse {  // Ответ сервера при GET запросе
    total: number; // общее количество товаров
    items: IProduct[];  // массив товаров, использует уже существующий тип IProduct
}

export interface IOrderRequest { // Данные, которые мы отправляем при POST запросе
    payment: IBuyer['payment'];  // используем уже существующий тип оплаты
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];  // массив id товаров
}

export interface IOrderResponse { // Ответ сервера при успешном создании заказа
    id: string; // id заказа, присвоенный сервером
    total: number; // итоговая сумма заказа
}


// Открытие карточки товара
 export interface IGalleryCardClick {
  product: IProduct;
  imageSrc: string;
}









