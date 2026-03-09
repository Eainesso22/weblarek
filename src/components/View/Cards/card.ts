import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

//Базовый класс карточки товара

export abstract class Card<T extends IProduct> {
  protected container: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected events: IEvents;
  protected productId?: string;

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;

    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }

  //Устанавливает основные данные товара (название, цену, идентификатор)

  setData(product: T): void {
    this.productId = product.id;
    this.titleElement.textContent = product.title;
    this.priceElement.textContent = product.price !== null
      ? `${product.price} синапсов`
      : 'Бесценно';
  }

  render(): HTMLElement {
    return this.container;
  }
}

export class CardWithImage<T extends IProduct> extends Card<T> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected _CDN_URL = CDN_URL;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);

    this.imageElement.addEventListener('error', () => {
      console.error('Ошибка загрузки изображения:', this.imageElement.src);
    });
  }

  set image(src: string) {
    const finalSrc = src.startsWith('http')
      ? src
      : `${this._CDN_URL}/${src.replace(/\.[^/.]+$/, '.png')}`;

    this.setImage(this.imageElement, finalSrc, this.titleElement.textContent || '');
  }

  set category(category: string) {
    this.categoryElement.textContent = category;
    const categoryClass = categoryMap[category] || 'card__category_other';
    this.categoryElement.className = `card__category ${categoryClass}`;
  }

  protected setImage(imgElement: HTMLImageElement, src: string, alt: string): void {
    imgElement.src = src;
    imgElement.alt = alt;
  }

  setData(product: T): void {
    super.setData(product);
    if (product.image) {
      this.image = product.image;
    }
    if (product.category) {
      this.category = product.category;
    }
  }
}