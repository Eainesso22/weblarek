import { Card } from "./card";
import { IProduct } from "../../../types";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";



export class CardCatalog extends Card<IProduct> {
  private productData!: IProduct;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener("click", () => {

      if (!this.productData) return;

      this.events.emit("gallery:card-click", {
        id: this.productData.id,
      });
    });
  }

  setData(product: IProduct, index?: number) {
    super.setData(product, index);
    this.productData = product;
  }
}

