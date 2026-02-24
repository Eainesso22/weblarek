import "./scss/styles.scss";

import { Cart } from "./components/Models/Cart/Cart";
import { Products } from "./components/Models/Products/Products";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/ApiService";
import { API_URL } from "./utils/constants";
import { IGalleryCardClick } from "./types";
import { Buyer } from "./components/Models/Buyer/Buyer";

import { Gallery } from "./components/View/gallery";
import { Header } from "./components/View/header";
import { CardCatalog } from "./components/View/Сards/cardCatalog";
import { CardPreview } from "./components/View/Сards/cardPreview";
import { Modal } from "./components/View/Modal/modal";
import { Basket } from "./components/View/basket";
import { OrderForm, IOrderFormData } from "./components/View/Forms/orderForm";
import {
  ContactsForm,
  IContactsFormData,
} from "./components/View/Forms/contactsForm";
import { Success } from "./components/View/Modal/success";
import { CardBasket } from "./components/View/Сards/cardBasket";

import { ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { IProduct } from "./types";

// Инициализация
const events = new EventEmitter();

// Модели
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Представления
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"), events);
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const header = new Header(ensureElement<HTMLElement>(".header"), events);

// Корзина
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketContent = basketTemplate.content.firstElementChild!.cloneNode(
  true
) as HTMLElement;
const basket = new Basket(basketContent, events);

// API
const apiInstance = new Api(API_URL);
const apiService = new ApiService(apiInstance);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

// Загрузка товаров
async function loadProducts() {
  try {
    const products = await apiService.getProducts();
    productsModel.setItems(products);
  } catch (err) {
    console.error("Ошибка при получении товаров:", err);
  }
}

// Рендер каталога
events.on("catalog:changed", () => {
  const itemsCards = productsModel.getItems().map((item, index) => {
    const cardElement =
      cardCatalogTemplate.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;
    const card = new CardCatalog(cardElement, events);
    card.setData(item, index);
    return card.render();
  });

  gallery.render({ catalog: itemsCards });
});

events.on("gallery:card-click", ({ product, imageSrc }: IGalleryCardClick) => {
  const template = ensureElement<HTMLTemplateElement>("#card-preview");
  const content = template.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;
  const cardPreview = new CardPreview(content, events);

  const inCart = cartModel.hasItem(product.id);
  cardPreview.setData({ ...product, image: imageSrc, inCart });

  modal.open(content);
});

// Добавление/удаление товара из корзины
events.on("product:toggle", ({ id }: { id: string }) => {
  if (cartModel.hasItem(id)) cartModel.removeItem(id);
  else {
    const product = productsModel.getItemById(id); 
    if (product) cartModel.addItem(product);
  }
});

// Обновление корзины
events.on("cart:changed", ({ items }: { items?: IProduct[] } = {}) => {
  const basketItems = items || cartModel.getItems();
  const basketItemsHtml = basketItems.map((item, index) => {
    const template = ensureElement<HTMLTemplateElement>("#card-basket");
    const node = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;
    const card = new CardBasket(node, events);
    card.setData(item, index);
    return card.render();
  });

  basket.update(basketItemsHtml, cartModel.getTotalPrice());
  header.counter = cartModel.getCount();
});

// Открытие корзины
events.on("basket:open", () => {
  const basketButton =
    basketContent.querySelector<HTMLButtonElement>(".basket__button")!;
  basketButton.onclick = () => events.emit("order:open");

  modal.open(basketContent);
});

// Удаление товара из корзины 
events.on("basket:remove", ({ id }: { id: string }) => { 
  cartModel.removeItem(id); 
});

// Форма заказа
events.on("order:open", () => {
  const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
  const orderContent = orderTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLFormElement;
  const orderForm = new OrderForm(orderContent);

  orderForm.onSubmit((formData: IOrderFormData) => {
    modal.close();
    events.emit("order:completed", { orderData: formData });
  });

  modal.open(orderContent);
});

// Форма контактов
events.on("contacts:open", () => {
  const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
  const contactsContent = contactsTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLFormElement;
  const contactsForm = new ContactsForm(contactsContent, events);

  contactsForm.onSubmit();
});

// Валидация (по изменению полей)
events.on(
  "buyer:fieldChanged",
  ({ formData }: { formData: { email: string; phone: string } }) => {
    // Передаём данные в модель
    buyerModel.setData(formData);
  }
);

// Сабмит формы контактов
events.on(
  "contacts:submitted",
  ({ formData }: { formData: IContactsFormData }) => {
    const errors: Record<string, string> = {};

    if (!formData.email.includes("@")) errors.email = "Неверный email";
    if (!formData.phone.match(/^\+?\d{10,15}$/))
      errors.phone = "Неверный телефон";

    events.emit("buyer:validated", { errors });

    if (Object.keys(errors).length === 0) {
      const total = cartModel.getTotalPrice();
      const successTemplate = ensureElement<HTMLTemplateElement>("#success");
      const successContent =
        successTemplate.content.firstElementChild!.cloneNode(
          true
        ) as HTMLElement;
      const success = new Success(successContent, events);

      success.message = `Списано ${total} синапсов`;

      cartModel.clear();
      events.emit("cart:changed", { items: cartModel.getItems() });

      success.onClose(() => {
        modal.close();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      modal.open(success.render());
    }
  }
);

loadProducts();
