/* global Handlebars, utils, dataSource, settings */ // eslint-disable-line no-unused-vars

{
  'use strict';

const select = {
  templateOf: {
    menuProduct: "#template-menu-product",
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = { // eslint-disable-line no-unused-vars
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    }
  }; // eslint-disable-line no-unused-vars

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); 
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form); 
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs); 
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton); 
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    initAccordion() {
      const thisProduct = this; 
      //const clickableTrigger =   thisProduct.element.querySelector(select.menuProduct.clickable); 
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
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
      thisProduct.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder(); 
      });
      for(let input of thisProduct.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder(); 
        });
      }
      thisProduct.cartButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        thisProduct.processOrder(); 
      });
    }
    processOrder() {
      const thisProduct = this; // eslint-disable-line no-unused-vars
      const formData = utils.serializeFormToObject(thisProduct.form);
      
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
      thisProduct.priceElem.innerHTML = price;
    }
    initAmountWidget() {
      const thisProduct = this; 

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', () => thisProduct.processOrder()); // element html oczywiście będzie nasłuchiwał, nie instancja klasy AmountWidget
    }
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this; 
      
      thisWidget.getElements(element);
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

    init: function(){
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu(); 
    },
  };

  app.init();
}

