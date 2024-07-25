class BaseWidget{
    constructor(wrapperElement, initialValue) {
        const thisWidget = this; 

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapperElement;

        thisWidget.correctValue = initialValue; 
    }

    get value() {
        const thisWidget = this; 

        return thisWidget.correctValue; 
    }

    set value(value) {
        const thisWidget = this; 
  
        const newValue = thisWidget.parseValue(value);
        /* TODO: Add validation */
        if(thisWidget.correctValue !== newValue && thisWidget.isValid(newValue)) {
          thisWidget.correctValue = newValue;
          thisWidget.announce();
        }
        thisWidget.renderValue(); // musi być poza ifem, żeby w przypadku wpisania nieprawidłowej wartości od razu zmieniała się wartość  na właściwą
        // gdyby było w warunku oczywiście trzeba by było kliknąć dwa razy aby pobrała się odpowiednia wartość i dopiero przeszło dalej
        // nie działał by też enter po wyjściu z inputu, wartość i tak by zostawała. 
      }

      setValue(value) {
        const thisWidget = this; 

        thisWidget.value = value; 
      }

      parseValue(value){
        return parseInt(value);
      }
  
      isValid(value) {
        return !isNaN(value);
      }

      renderValue() {
        const thisWidget = this; 

        thisWidget.dom.wrapper.innerHTML = thisWidget.value;
      }

      announce() {
        const thisWidget = this; 
        const event = new Event('updated', {
          bubbles: true
        });
        thisWidget.dom.wrapper.dispatchEvent(event);
      }
}

export default BaseWidget;