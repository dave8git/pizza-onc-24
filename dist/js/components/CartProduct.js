import { select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this; 
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price; 
      thisCartProduct.params = menuProduct.params; 
      
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
    }

    getElements(element) {
      const thisCartProduct = this; 
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      //thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);
      thisCartProduct.dom.amountWidgetElem = element.querySelector(select.cartProduct.amountWidget);

    }

    initActions() {
      const thisCartProduct = this; 
      thisCartProduct.dom.edit.addEventListener('click', function() {
        event.preventDefault();
      });
      thisCartProduct.dom.remove.addEventListener('click', function() {
        event.preventDefault();
        thisCartProduct.remove();
      });
    }
    initAmountWidget() {
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidgetElem);
      thisCartProduct.dom.amountWidgetElem.addEventListener('updated', function() {
        thisCartProduct.price = thisCartProduct.amountWidget.value * thisCartProduct.priceSingle;
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      })
    }
    remove() {
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct
        }
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }
    getData() {
      const thisCartProduct = this; 
      const data = {
        id: thisCartProduct.id,
        amount: thisCartProduct.amount,
        price: thisCartProduct.price,
        priceSingle: thisCartProduct.priceSingle,
        name: thisCartProduct.name,
        params: thisCartProduct.params,
      }

      console.log('thisCartProduct', thisCartProduct);
      return data;
    }
  }

  export default CartProduct;