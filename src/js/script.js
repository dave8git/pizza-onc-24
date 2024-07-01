/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

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

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 0,
      defaultMax: 10,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data) {
      const thisProduct = this; 
      thisProduct.id = id;
      thisProduct.data = data; 
      console.log('new Product', thisProduct);
      thisProduct.renderInMenu();
    }
    renderInMenu() {
      const thisProduct = this;
      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /* find menu container */
      const container = document.querySelector(select.containerOf.menu);
      /* add element to menu */
      container.appendChild(thisProduct.element);
    }
    initAccordion() {
      const thisProduct = this; 
      /* find the clickable triger (the element that should react to clicking) */
      const clickableTrigger = ???  // <- tu usuzpełnić, znikną błędy w kodzie
      /* START: add event listener to clicable trigger on event click */
      clickableTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */

        /* find active product (product that has active class) */

        /* if there is active product and it's not thisProduct.element, remove class active from it */

        /* toggle active class on thisProduct.element */ 
      });

    }
  }


  const app = {

    initMenu: function(){
      const thisApp = this;

      console.log('thisApp.data:', thisApp.data); // thisApp.data pochodzi oczywiście z funkcji initData
      
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
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu(); 
    },
  };

  app.init();
}
