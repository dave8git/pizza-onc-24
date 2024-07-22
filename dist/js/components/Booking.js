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
        console.log('element', element);
        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        console.log('element 2', element);
        thisBooking.dom.wrapper.innerHTML = generatedHTML;
    }

    initWidget() {
        const thisBooking = this; 



    }
}

export default Booking;