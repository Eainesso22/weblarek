# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

#### Данные

Товар:

interface IProduct {
id: string; // уникальный идентификатор товара
description: string;  // подробное описание товара
image: string;  // ссылка на изображение товара
title: string;  // название товара
category: string;  // категория товара
price: number | null;  // цена товара, null если цена не задана
}


Покупатель:

interface IBuyer {
payment: TPayment;  // способ оплаты
email: string;      // почта покупателя
phone: string;      // телефон покупателя
address: string;    // адрес доставки
}

#### Модели данных

1-й класс - Каталог товаров - Products

Поля класса (Хранение товаров, которые можно купить в приложении):
Хранит массив всех товаров
Хранит товар, выбранный для подробного отображения

Методы:
Cохранение массива товаров полученного в параметрах метода - setItems
Получение массива товаров из модели - getItems
Получение одного товара по его id - getItemById
Сохранение товара для подробного отображения - setSelectedItem
Получение товара для подробного отображения - getSelectedItem


2-й класс - Корзина с товарами - Cart

Поля класса (Хранение товаров, которые пользователь выбрал для покупки):
Хранит массив товаров, выбранных покупателем для покупки

Методы:
Получение массива товаров, которые находятся в корзине - getItems
Добавление товара, который был получен в параметре, в массив корзины - addItem
Удаление товара, полученного в параметре из массива корзины - removeItem
Очистка корзины - clear
Получение стоимости всех товаров в корзине - getTotalPrice
Получение количества товаров в корзине - getCount
Проверка наличия товара в корзине по его id, полученного в параметр метода - hasItem

3-й класс - Покупатель - Buyer

Поля класса (Данные покупателя, которые тот должен указать при оформлении заказа):
вид оплаты
адреc
телефон
email

Методы:
Cохранение данных в модели - setData
Получение всех данных покупателя - getData
Очистка данных покупателя - clear
Валидация данных - validate

#### Слой коммуникации

class ApiService - отправляет и получает данные через API

Данные (Ответ сервера при Get запросе):
Общее количество товаров - total
Массив товаров использует существующий тип IProduct - items

Данные (Отправка данных при POST запросе):
Используем уже существующий тип оплаты - IBuyer['payment']
вид оплаты
адреc
телефон
email
Массив id товаров - items

Методы:
Получение данных с сервера - getProducts
Отправление данных на сервер - postOrder

#### View слой

Класс Component<T>
Базовый компонент.Установка данных.

interface(тип данных):
data: T;

Элементы разметки:
container: HTMLElement;

Методы:
setData(data: T): void; - установка и обновление DOM данных.
setImage(element: HTMLImageElement, src: string, alt?: string): void;
getData(): T; - возвращает текущие данные компонента.
render(): HTMLElement;

Класс - Header - компонент header сайта, показывает логотип, корзину и счетчик товаров.

Interface(тип данных):
counter:number;
Элементы разметки:
basketButton: HTMLButtonElement; - кнопка корзины.
counterElement: HTMLElement; - счетчик с числом товаров.
Метод:
set counter(value: number); - обновляет число товаров в корзине.

Класс - Gallery - контейнер с карточками товаров на главной странице.

Interface(тип данных):
catalog:HTMLElement[]; - массив карточек товаров.
Элементы разметки:
catalogElement: HTMLElement; - контейнер для галереи (.gallery)
Методы:
set catalog(items: HTMElement[]);

Класс - Modal - модальное окно

Interface(тип данных):
modalClose: HTMLButtonElement;
modalContent: HTMLElement;
Элементы разметки:
container: HTMLElement;
modalClose: HTMLButtonElement;
modalContent: HTMLElement;
Методы:
set content(items: HTMElement);

Класс - Success - Сообщение об успешном оформлении заказа.

Interface(тип данных):
message: string;
Элементы разметки:
container: HTMLElement;
titleElement: HTMLElement;
descriptionElement: HTMLElement;
closeButton: HTMLButtonElement;
Методы:
set message(value: string); обновляет текст в descriptionElement.
render(): HTMLElement; возвращает готовый DOM элемент для вставки в модальное окно.

Класс Card<T> общий фунционал карточки товара.

Interface(тип данных):
product: IProduct;
index?: number;

Элементы разметки:
container: HTMLButtonElement;
imageElement: HTMLImageElement;
categoryElement: HTMLElement;
titleElement: HTMLElement;
priceElement: HTMLElement;

Методы:
setData(product: IProduct, index?: number): void; - Устанавливает общие данные: название, категорию, изображение, цену.
render(): HTMLElement;

Класс - CardCatalog - карточка товара.

Interface(тип данных):
наследует Card<IProduct>
Методы:
render(): HTMLButtonElement; - возвращает готовую карточку для вставки в галерею.

Класс - CardPreview - подробная карточка товара.

Interface(тип данных):
наследует Card<IProduct>
Элементы разметки:
descriptionElement: HTMLElement;
buttonElement: HTMLButtonElement;
Методы:
render(): HTMLElement; - возвращает готовую карточку для вставки в галерею.

Класс - CardBasket - подробная карточка товара.

Interface(тип данных):
наследует Card<IProduct>
index: number;
Элементы разметки:
deleteButton: HTMLButtonElement;
Методы:
setData(product: IProduct, index: number): void; - устанавливает данные товара (название, цену, изображение, категорию)
render(): HTMLElement; - возвращает готовую карточку для вставки в галерею.

Класс - Basket - модальное окно корзины.
отображает список товаров, их суммарную стоимость и кнопку оформления.

Interface(тип данных):
items: CardBasket[]; - массив карточек товаров в корзине.
totalPrice: number;
Элементы разметки:
container: HTMLElement;
listElement: HTMLElement;
checkoutButton: HTMLButtonElement;
priceElement: HTMLElement;
Методы:
render(): HTMLElement;
addItem(item: CardBasket): void;
removeItem(index: number): void;
updateTotalPrice(): void;
clear(): void;

Класс Form<T> - общий функционал для всех форм (валидация, блокировка кнопки отправки, обработка ошибок)

Interface(тип данных):
fields: Record<sting, HTMLInputElement>; - обьект поля формы
errors: HTMLElement; - контейнер для вывода сообщений об ошибках
isValid: boolean;

Элементы разметки:
container: HTMLFormElement; — корневой элемент <form>.
submitButton: HTMLButtonElement; — кнопка отправки.
errorContainer: HTMLElement; - элемент для вывода ошибок.

Методы:
setFieldValue(name: string, value: string): void - установка значения поля;
getFieldValue(name: string): string - возвращает текущее значение поля;
setError(message: string): void - отображает текст ошибки в контейнер (errors: HTMLElement)
clearError(): void;
set valid(value: boolean);
onSubmit(handler: (formData: Record<string, string>) => void): void; - назначает обработчик отправки формы(сбор и отправка данных в handler)

Класс OrderForm - форма заказ;

Interface(тип данных):
address: string;
paymentMethod: 'online' | 'cash';

Элементы разметки:
container: HTMLFormElement;
addressInput: HTMLInputElement;
onlineButton: HTMLButtonElement;
cashButton: HTMLButtonElement;
submitButton: HTMLButtonElement;
errorContainer: HTMLElement;
Методы:
selectPaymentMethod(method: 'online' | 'cash'): void;
validate(): boolean - проверка всех заполненых полей и обновление кнопки отправки.

Класс ContactsForm - форма контактных данных.

Interface (тип данных):
email: string;
phone: string;

Элементы разметки:
container: HTMLFormElement; - корневая форма.
emailInput: HTMLInputElement;
phoneInput: HTMLInputElement;
submitButton: HTMLButtonElement;
errorContainer: HTMLElement;
Методы:
validateEmail(): boolean
validatePhone(): boolean
validate(): boolean - обновление состояния valid

#### Реализация классов представления событий.

Классы CardCatalog, CardPreview, CardBasket
card:click; - событие клика
interface: {product: IProduct, index?: number};

Класс CardPreview
card:add-to-basket; - событие добавления.
interface: {product: IProduct};

Класс CardBasket
card:remove-from-basket; -событие удаления.
interface: {index: number};

Класс Header
gallery: basket-click; - событие клика на корзину.
Окрытие модального окна корзины.

Класс Gallery
gallery:card-click; - событие клика на карточку в галерее.
interface: {product: IProduct};

Класс Modal
modal:close;

modal:open;
interface: {content: HTMLElement};

Класс Basket
basket:add-item; - событие добавление и обновление карточек в корзину.
interface: {item: number};

basket:remove-item - событие удаления карточки из корзины.
interface: {index: number};

basket:checkout; - событие открытия форм заказа.

Классы OrderForm, ContactsForm

Класс OrderForm
form:submit; - событие передачи данных OrderForm.
interface: {
address: { adress:string, paymentMethod: 'online' | 'cash};
form:payment-select; - событие формы на тип оплаты.
form:validation; {isValid: boolean}; - обновление состояния валидации форм.
}

Класс ContactsForm
form:submit; - событие передачи данных формы СontactsForm.
interface: { email: string; phone: string }
form:validation; { isValid: boolean }

#### Presenter( Отвечающий за логику взаимодействия между Model, View и API.)

    Products
    products:changed - событие
    Получает список товаров, создаёт карточки (CardCatalog), передаёт их в Gallery для отображение каталога.

    Gallery
    gallery: card-click - событие
    Устанавливает выбранный товар в модели Products, открывает модальное окно с CardPreview.

    CardPreview
    card:add-to-basket - событие
    Добавляет товар в Cart, обновляет счётчик товаров в Header.

    CardBasket
    card:remove-from-basket - событие
    Удаляет товар из Cart, пересчитывает сумму и обновляет корзину.

    Сart
    cart:changed - событие
    Обновляет количество товаров и итоговую стоимость в представлениях.

    Header
    header:basket-click - событие
    Открывает модальное окно с корзиной (Basket).

    Basket
    basket:checkout - событие
    Открывает форму оформления заказа (OrderForm).

    OrderForm
    form:submit, form:payment-select- событие
    Проверяет данные формы, сохраняет адрес и способ оплаты, открывает ContactsForm,
    cохраняет выбранный способ оплаты в модель Buyer.

    ContactsForm
    form:submit - событие
    Передаёт все данные заказа в ApiService.postOrder, очищает модели, отображает Success.

    OrderForm, ContactsForm
    form:validation - событие
    Переключает доступность кнопки отправки в зависимости от валидности данных.

    Modal
    modal:close - событие
    Очищает временные данные и сбрасывает состояние активных компонентов.


    Последовательность раблты приложения:
    

Инициализация данных
Презентер получает список товаров с сервера через ApiService.getProducts и сохраняет их в модель Products.
После успешного получения данных вызывается событие products:changed.

Отображение каталога
Обработчик products:changed создаёт карточки (CardCatalog) и передаёт их в компонент Gallery для рендера.

Просмотр товара
При клике на карточку (gallery:card-click) презентер получает объект товара и открывает модальное окно с CardPreview.

Добавление товара в корзину
При событии card:add-to-basket товар сохраняется в модели Cart, после чего обновляется счётчик в Header.

Удаление товара из корзины
При событии card:remove-from-basket презентер вызывает cart.removeItem() и обновляет компонент Basket.

Открытие корзины
При событии header:basket-click открывается модальное окно с содержимым корзины.

Оформление заказа
При событии basket:checkout открывается OrderForm, где пользователь вводит адрес и выбирает способ оплаты.

Переход ко второй форме
После подтверждения первой формы (form:submit из OrderForm) открывается форма контактов (ContactsForm).

Завершение оформления
После отправки формы контактов (form:submit из ContactsForm) данные передаются на сервер (ApiService.postOrder),
корзина очищается, и пользователю показывается сообщение Success.

Закрытие модального окна
При событии modal:close презентер очищает активное состояние форм и карточек, подготавливая интерфейс к следующему действию.
