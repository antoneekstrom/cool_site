export class Updator {
    /**
     * Construct Updator object. Updator initializes on instantation. It simply registers
     * to be notified when things are updated.
     */
    constructor() {
        window.onpopstate = this.notifyObservers();
        this.observers = [(route) => console.log('Router - newUrl: ' + route)];
    }

    /**
     * Used to notify observers when update occurs.
     */
    notifyObservers(data) {
        if (this.observers != null) {

            this.observers.forEach((observer, index) => {
                
                observer(data);
            });
        }
    }

    /**
     * Register to call supplied function on update.
     * @param {function(String)} callback Function to be called on update. New URL as parameter.
     */
    observe(callback) {
        this.observers.push(callback);
    }

    unobserve(func) {
        delete this.observers.find((val, i) => {val == func;});
    }
}