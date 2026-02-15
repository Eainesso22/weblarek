import { IApi, IProduct, IProductResponse } from "../../types";
import { IOrderRequest, IOrderResponse } from "../../types";

export class ApiService {
    private api: IApi; // композиция: хранит экземпляр базового Api
    
    constructor(api: IApi) {
        this.api = api;  // при создании передаём экземпляр Api
    }
  // Метод получения массива товаров с сервера
    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<IProductResponse>("/product/");
        return response.items;
    } 
    
    
    // Метод  отправки данных заказа на сервер
    async postOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
        const response = await this.api.post<IOrderResponse>("/order/", orderData);
        return response;
    
}
}9

