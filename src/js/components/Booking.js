import {templates} from '../settings.js';
import {utils} from '../utils.js';
class Booking{
    constructor(element) {
        const thisBooking = this; 

        thisBooking.render(element);
        thisBooking.initWidget(); 
    }

    render(element) {
        const thisBooking = this; 
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.element = utils.createDOMFromHTML(generatedHTML);
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.appendChild(generatedHTML);
    }

    initWidget() {
        const thisBooking = this; 
        


    }
}

export default Booking;