import {select, settings} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
    constructor(element) {
      super(element, settings.amountWidget.defaultValue); 
      const thisWidget = this; 
      
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.dom.input.value); 
      thisWidget.initActions();

      console.log('AmountWidget:', thisWidget);
    }

    getElements(element) {
      const thisWidget = this; 
      thisWidget.dom.wrapper = element; 
      thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
      thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    }

    initActions() {
      const thisWidget = this; 
  
      // Logging the elements to ensure they are correctly selected
      thisWidget.dom.input.addEventListener('change', function() {
        thisWidget.value = thisWidget.dom.input.value;
      });
  
      thisWidget.dom.linkDecrease.addEventListener('click', function() {
        thisWidget.setValue(thisWidget.value - 1);
      });
  
      thisWidget.dom.linkIncrease.addEventListener('click', function() {
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

  

    parseValue(value){
      return parseInt(value);
    }

    isValid(value) {
      return !isNaN(value) 
      && value <= settings.amountWidget.defaultMax 
      && value >= settings.amountWidget.defaultMin;
    }

    renderValue() {
      const thisWidget = this; 

      thisWidget.dom.input.value = thisWidget.value; 
    }
  }

  export default AmountWidget;