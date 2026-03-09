import { Card } from "./card"; 
import { IProduct } from "../../../types"; 
import { ensureElement } from "../../../utils/utils"; 
import { IEvents } from "../../base/Events"; 
 
export class CardPreview extends Card<IProduct> { 
  private descriptionElement: HTMLElement; 
  private buttonElement: HTMLButtonElement; 
 
  constructor(container: HTMLElement, events: IEvents) { 
    super(container, events); 
 
    this.descriptionElement = ensureElement<HTMLElement>( 
      ".card__text", 
      container 
    ); 
    this.buttonElement = ensureElement<HTMLButtonElement>( 
      ".card__button", 
      container 
    ); 
  } 
 
  // Установка данных 
  setData(product: IProduct & { inCart?: boolean }, index?: number) { 
    super.setData(product, index); 
    this.descriptionElement.textContent = product.description; 
 
    // Отрисовываем состояние кнопки 
    this.updateButton(product); 
 
    // Обновляем кнопку при изменении корзины 
    this.events.on("cart:changed", ({ items }: { items: IProduct[] }) => { 
      product.inCart = items.some((i) => i.id === product.id); 
      this.updateButton(product); 
    }); 
 
    this.buttonElement.onclick = () => { 
      if (!product.price) return; 
 
      // Сообщаем презентеру, что товар кликнут: 
      this.events.emit("product:toggle", { id: product.id }); 
 
      this.events.emit("modal:close"); 
    }; 
  } 
 
  private updateButton(product: IProduct & { inCart?: boolean }) { 
    if (!product.price) { 
      this.buttonElement.textContent = "Недоступно"; 
      this.buttonElement.disabled = true; 
    } else if (product.inCart) { 
      this.buttonElement.textContent = product.inCart 
        ? "Удалить из корзины" 
        : "Купить"; 
      this.buttonElement.disabled = false; 
    } else { 
      this.buttonElement.textContent = "Купить"; 
      this.buttonElement.disabled = false; 
    } 
  } 
} 
