import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product{
    constructor(id, data) {
      const thisProduct = this; 
      thisProduct.id = id;
      thisProduct.data = data; 
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget(); 
      thisProduct.processOrder(); 
      thisProduct.prepareCartProduct();
    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const container = document.querySelector(select.containerOf.menu);
      container.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this; 
      thisProduct.dom = {};
      thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); 
      thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form); 
      thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs); 
      thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton); 
      thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    initAccordion() {
      const thisProduct = this; 
      //const clickableTrigger =   thisProduct.element.querySelector(select.menuProduct.clickable); 
      thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {
        event.preventDefault();
        const activeProduct = document.querySelector(classNames.menuProduct.wrapperActive);
         if(activeProduct && activeProduct != thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
        thisProduct.element.classList.toggle('active');
      });
    }
    initOrderForm(){
      const thisProduct = this; 
      thisProduct.dom.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder(); 
      });
      for(let input of thisProduct.dom.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder(); 
        });
      }
      thisProduct.dom.cartButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        thisProduct.processOrder(); 
        thisProduct.addToCart();
      });
    }
    processOrder() {
      const thisProduct = this; // eslint-disable-line no-unused-vars
      const formData = utils.serializeFormToObject(thisProduct.dom.form);
      
      let price = thisProduct.data.price; 
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        for(let optionId in param.options) {
          const option = param.options[optionId];
          if(formData[paramId] && formData[paramId].includes(optionId)) {
            const foundElement = thisProduct.element.querySelector(`.${paramId}-${optionId}`);
            if(foundElement) {
              foundElement.classList.add('active');
            }
            if(!option.default) {
              price += option.price;
            } 
          } else {
            const foundElement = thisProduct.element.querySelector(`.${paramId}-${optionId}`);
            if(foundElement) {
              foundElement.classList.remove('active');
            }
            if(option.default) {
              price -= option.price;
           
            }
          }
        }
      }
      price *= thisProduct.amountWidget.value;
      thisProduct.dom.priceElem.innerHTML = price;
      thisProduct.price = price;
      thisProduct.prepareCartProduct();
    }
    initAmountWidget() {
      const thisProduct = this; 

      thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);
      thisProduct.dom.amountWidgetElem.addEventListener('updated', () => thisProduct.processOrder()); // element html oczywiście będzie nasłuchiwał, nie instancja klasy AmountWidget
    }

    addToCart() {
      const thisProduct = this; 

      //app.cart.add(thisProduct.prepareCartProduct()); //thisApp.cart = new Cart(cartElem); <-- w app zapisaliśmy nową instancję klasy Cart do thisApp.cart czyli tutaj możemy przeczytać jako app.cart (obiekt app, metoda cart)
      // z racji tego, instancja klasy Product tworzona jest w obiekcie app, klasa/instancja Product może odwołać się do jej metod (app jest nadrzędnym obiektem)
      // tutaj odwołuje się do metody add w klasie Cart (której instancja była zapisana w thisApp.cart), i przekazuje jej instancję klasy Product.
      
      const event = new CustomEvent('add-to-cart', {
        bubbles: true,
        detail: {
            product: thisProduct.prepareCartProduct(),
        }
      });
      thisProduct.element.dispatchEvent(event); 
    }

    prepareCartProductParams() {
      const thisProduct = this; 
      const formData = utils.serializeFormToObject(thisProduct.dom.form);
      const params = {};
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        params[paramId] = {
          label: param.label,
          options: {},
        }
        for(let optionId in param.options) {
          const option = param.options[optionId];
          if(formData[paramId] && formData[paramId].includes(optionId)) {
            params[paramId].options[optionId] = option.label;
          } 
        }
      }
  
      return params;
    }

    prepareCartProduct() {
      const thisProduct = this; 

      const productSummary = {}; 
      productSummary.id = thisProduct.id;
      productSummary.name = thisProduct.data.name; 
      productSummary.amount = thisProduct.amountWidget.value;
      productSummary.priceSingle = thisProduct.data.price;
      productSummary.price = thisProduct.price;
      productSummary.params = thisProduct.prepareCartProductParams();

      return productSummary;
    }
  }

  export default Product;