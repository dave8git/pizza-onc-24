/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

  const app = {
  initPages: function() {
    const thisApp = this; 
    
    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');
    
    thisApp.activatePage(idFromHash); 

    let pageMatchingHash = thisApp.pages[0].id; 

    for(let page of thisApp.pages) {
      if(page.id == idFromHash) {
  // eslint-disable-next-line no-unused-vars
        pageMatchingHash = page.id;
        console.log(pageMatchingHash);
        break; // dzięki break nie zostaną wykonane dalsze pętle jeżeli warunek będzie prawidziwy. 
      }
    }

    for(let link of thisApp.navLinks) {
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault(); 
        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activePaget with that id */ 
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
  
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this; 
    /* add class "active" to matching pages, remove from non-matching */
    for(let page of thisApp.pages) {
      // if(page.id == pageId) {
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /* add class "active" to matching links, remove from non-matching */
 
    for(let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function () {
    const thisApp = this;

    //console.log('thisApp.data:', thisApp.data); // thisApp.data pochodzi oczywiście z funkcji initData

    for (let productName in thisApp.data.products) {
      new Product(thisApp.data.products[productName].id, thisApp.data.products[productName]);
    }
  },

  initData: function () {
    const thisApp = this;

    //thisApp.data = dataSource;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem); //tu zapisujemy instancję koszyka do app.cart

    thisApp.productList = document.querySelector(select.containerOf.menu); 

    thisApp.productList.addEventListener('add-to-cart', function(event) {
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function () {
    // const thisApp = this; 

    const widgetContainer = document.querySelector(select.containerOf.booking);
    const booking = new Booking(widgetContainer);
    console.log(booking);
    console.log('widgetContainer', widgetContainer);
  },

  init: function () {
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking(); 
  },
};

app.init();


