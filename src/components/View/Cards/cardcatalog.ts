import { Card } from "./card";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";


export class CardCatalog extends Card<IProduct> {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    
    // Единый обработчик клика – использует productId из базового класса
    this.container.addEventListener('click', () => {
      if (this.productId) {
        this.events.emit('gallery:card-click', { id: this.productId });
      }
    });
  }

  setData(product: IProduct, index?: number): void {
    super.setData(product); // базовый класс сохраняет productId, title, price
    
    if (index !== undefined) {
      const indexElement = this.container.querySelector('.card__index');
      if (indexElement) {
        indexElement.textContent = String(index + 1);
      }
    }
  }
}