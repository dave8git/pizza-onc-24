import {templates, select} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Booking {
    constructor(element) {
        const thisBooking = this; 

        thisBooking.render(element);
        thisBooking.initWidget(); 
    }

    render(element) {
        const thisBooking = this; 
        console.log('element', element);
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        console.log('element 2', element);
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        thisBooking.dom.AmountWidgetElem = thisBooking.dom.wrapper.querySelector(select.booking.AmountWidget);
        console.log('thisBooking.dom.people', thisBooking.dom.peopleAmount);
        console.log('thisBooking.dom.hourseAmount', thisBooking.dom.hoursAmount);

    }


    initWidget() {
        const thisBooking = this; 

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

        thisBooking.dom.peopleAmount.addEventListener('updated', function() {
            console.log('peopleAmount ruszyło!');
        });

        thisBooking.dom.hoursAmount.addEventListener('updated', function() {
            console.log('hoursAmount ruszyło!');
        });
    }
}

export default Booking;