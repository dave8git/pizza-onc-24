import {select, classNames, templates, settings} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './CartProduct.js'; 

class Cart {
    constructor(element) {
      const thisCart = this; 
      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();
    }

    getElements(element) {
      const thisCart = this; 

      thisCart.dom = {};

      thisCart.dom.wrapper = element; 
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    }

    initActions() {
      const thisCart = this; 
      thisCart.dom.toggleTrigger.addEventListener('click', function() {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function() {
        thisCart.update(); 
      });
      thisCart.dom.productList.addEventListener('remove', function(e) {
        thisCart.remove(e.detail.cartProduct); 
      });
      thisCart.dom.form.addEventListener('submit', function() {
        event.preventDefault();
        thisCart.sendOrder();
      })
    }

    sendOrder() {
      const thisCart = this;
      console.log('thisCart.dom.address.value', thisCart.dom.address.value);
      console.log('thisCart.dom.phone.value', thisCart.dom.phone.value);
      console.log('thisCart.dom.totalPrice.value', thisCart.dom.totalPrice.innerHTML);
      console.log('thisCart.dom.subtotalPrice.value', thisCart.dom.subtotalPrice.innerHTML);
      console.log('thisCart.dom.totalNumber', thisCart.dom.totalNumber.innerHTML);

      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.dom.totalPrice.innerHTML,
        subtotalPrice: thisCart.dom.subtotalPrice.innerHTML,
        totalNumber: thisCart.dom.totalNumber.innertHTML,
        deliveryFee: select.cart.deliveryFee.innerHTML,
        products: []
      }
      // console.log('thisCart.dom.totalNumber', thisCart.dom.totalNumber);
      console.log('!!!!', thisCart.dom.totalNumber);
      for(let prod of thisCart.products) {
        payload.products.push(prod.getData());
        console.log('prod', prod);
      }
      console.log('payload', payload);

      const url = settings.db.url + '/' + settings.db.orders;

      // fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload)
      // });

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      fetch(url, options)
        .then(function(response){
          return response.json(); 
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
        });
    }

    remove(cartProduct) {
      const thisCart = this;
      console.log('cartProduct', cartProduct);
      cartProduct.dom.wrapper.remove();
      const productIndex = thisCart.products.indexOf(cartProduct);
      thisCart.products.splice(productIndex, 1);
      thisCart.update();
    }

    add(menuProduct) { // thisProduct == menuProduct
      const thisCart = this; 
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      thisCart.update();
    }

    update() {
      const thisCart = this; 
      const deliveryFee = settings.cart.defaultDeliveryFee;
      let totalNumber = 0;
      let subtotalPrice = 0; 
      for (let product of thisCart.products) {
        totalNumber += product.amount;
        subtotalPrice += product.price;
      }
      thisCart.dom.totalNumber.innerHTML = totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
      thisCart.totalPrice = subtotalPrice + deliveryFee;
      thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
      thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    }
  }

  export default Cart; 