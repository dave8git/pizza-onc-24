import {select, settings} from '../settings.js';

class AmountWidget {
    constructor(element) {
      const thisWidget = this; 
      
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value); 
      thisWidget.initActions();
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
      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
  
      thisWidget.linkDecrease.addEventListener('click', function() {
        thisWidget.setValue(thisWidget.value - 1);
      });
  
      thisWidget.linkIncrease.addEventListener('click', function() {
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    setValue(value) {
      const thisWidget = this; 

      const newValue = parseInt(value);
      /* TODO: Add validation */
      if(thisWidget.value !== newValue && !isNaN(newValue) && newValue <= settings.amountWidget.defaultMax && newValue >= settings.amountWidget.defaultMin) {
        thisWidget.value = newValue;
        const event = new Event('updated');
        thisWidget.element.dispatchEvent(event);
        thisWidget.announce();
      }
      thisWidget.input.value = thisWidget.value; // musi być poza ifem, żeby w przypadku wpisania nieprawidłowej wartości od razu zmieniała się wartość  na właściwą
      // gdyby było w warunku oczywiście trzeba by było kliknąć dwa razy aby pobrała się odpowiednia wartość i dopiero przeszło dalej
      // nie działał by też enter po wyjściu z inputu, wartość i tak by zostawała. 
    }
    announce() {
      const thisWidget = this; 
      const event = new Event('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }

  export default AmountWidget;