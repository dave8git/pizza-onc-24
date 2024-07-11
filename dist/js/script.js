/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
  templateOf: {
    menuProduct: "#template-menu-product",
    cartProduct: '#template-cart-product', 
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', //'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };


  class Product{
    constructor(id, data) {
      const thisProduct = this; 
      thisProduct.id = id;
      thisProduct.data = data; 
      //console.log('new Product', thisProduct);
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget(); 
      thisProduct.processOrder(); 
      thisProduct.prepareCartProduct();
      console.log(thisProduct);
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

      app.cart.add(thisProduct.prepareCartProduct()); //thisApp.cart = new Cart(cartElem); <-- w app zapisaliśmy nową instancję klasy Cart do thisApp.cart czyli tutaj możemy przeczytać jako app.cart (obiekt app, metoda cart)
      // z racji tego, instancja klasy Product tworzona jest w obiekcie app, klasa/instancja Product może odwołać się do jej metod (app jest nadrzędnym obiektem)
      // tutaj odwołuje się do metody add w klasie Cart (której instancja była zapisana w thisApp.cart), i przekazuje jej instancję klasy Product.
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

      console.log('productSummary', productSummary);
      console.log('thisProduct', thisProduct);

      return productSummary;
    }
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this; 
      
      thisWidget.getElements(element);
      console.log('thisWidget.input', thisWidget);
      thisWidget.setValue(thisWidget.input.value); 
      thisWidget.initActions();
      console.log('thisWidget.element from AmountWidget', thisWidget.element);
      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments:', element);
    }

    getElements(element) {
      const thisWidget = this; 
      thisWidget.element = element; 
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    initActions() {
      const thisWidget = this; 
  
      // Logging the elements to ensure they are correctly selected
      console.log('linkIncrease:', thisWidget.linkIncrease);
      console.log('linkDecrease:', thisWidget.linkDecrease);
  
      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
  
      thisWidget.linkDecrease.addEventListener('click', function() {
        console.log('linkDecrease');
        thisWidget.setValue(thisWidget.value - 1);
      });
  
      thisWidget.linkIncrease.addEventListener('click', function() {
        console.log('linkIncrease');
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    setValue(value) {
      const thisWidget = this; 

      const newValue = parseInt(value);
      console.log('newValue', newValue);
      /* TODO: Add validation */
      if(thisWidget.value !== newValue && !isNaN(newValue) && newValue <= settings.amountWidget.defaultMax && newValue >= settings.amountWidget.defaultMin) {
        thisWidget.value = newValue;
        const event = new Event('updated');
        thisWidget.element.dispatchEvent(event);
      }
      thisWidget.input.value = thisWidget.value; // musi być poza ifem, żeby w przypadku wpisania nieprawidłowej wartości od razu zmieniała się wartość  na właściwą
      // gdyby było w warunku oczywiście trzeba by było kliknąć dwa razy aby pobrała się odpowiednia wartość i dopiero przeszło dalej
      // nie działał by też enter po wyjściu z inputu, wartość i tak by zostawała. 
    }
  }

  class Cart {
    constructor(element) {
      const thisCart = this; 
      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();
      console.log('new Cart', thisCart);
    }

    getElements(element) {
      const thisCart = this; 

      thisCart.dom = {};

      thisCart.dom.wrapper = element; 
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);

      console.log('thisCart.dom.toggleTrigger', thisCart.dom.toggleTrigger);
    }

    initActions() {
      const thisCart = this; 
      thisCart.dom.toggleTrigger.addEventListener('click', function() {
        console.log('toggleTrigger clicked');
        console.log('thisCart.dom.wrapper', thisCart.dom.wrapper);
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }

    add(menuProduct) { // thisProduct == menuProduct
      const thisCart = this; 

      console.log('adding product', menuProduct);
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      //thisCart.dom.productList.appendChild(generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      console.log('thisCart.products', thisCart.products);

    }
  }

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
      console.log('thisCartProduct', thisCartProduct);
    }

    getElements(element) {
      const thisCartProduct = this; 
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = element.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector(select.cartProduct.remove);

    }

  }
  const app = {

    initMenu: function(){
      const thisApp = this;

      //console.log('thisApp.data:', thisApp.data); // thisApp.data pochodzi oczywiście z funkcji initData
      
      for (let productName in thisApp.data.products) {
        new Product(productName, thisApp.data.products[productName]);
      }
    },

    initData: function() {
      const thisApp = this; 

      thisApp.data = dataSource;
    },

    initCart: function() {
      const thisApp = this; 

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem); //tu zapisujemy instancję koszyka do app.cart
    },

    init: function(){
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu(); 
      thisApp.initCart();
    },
  };

  app.init();
}

