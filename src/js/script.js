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
      console.log('thisProduct.form', thisProduct.form);
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      let price = thisProduct.data.price; 
      for(let paramId in thisProduct.data.params) {
        console.log('paramId', paramId);
        const param = thisProduct.data.params[paramId];
        console.log('param', param);
        for(let optionId in param.options) {
          const option = param.options[optionId];
        }
      }
      thisProduct.priceElem.innerHTML = price;
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

