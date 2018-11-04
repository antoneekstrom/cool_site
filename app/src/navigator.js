/**
 * Calls observers with new route whenever URL is changed (with this router).
 */
class Navigator {
    /**
     * Construct Router object. Router initializes on instantation. It simply registers
     * to be notified when user navigates history.
     */
    constructor() {
        window.onpopstate = this.notifyObservers();
        this.observers = [(route) => console.log('Router - newUrl: ' + route)];
    }

    /**
     * Used to notify observers when any change occurs in the URL. All history navigations
     * will trigger it, but routing will need to happen from this specific instance for pushState()
     * to be recognized.
     */
    notifyObservers() {
        if (this.observers != null) {

            this.observers.forEach((observer, index) => {
                
                var newroute = window.location.pathname;
                observer(newroute);
            });
        }
    }

    /**
     * Register to call supplied function when URL changes.
     * @param {function(String)} callback Function to be called when URL changes. New URL as parameter.
     */
    observe(callback) {
        this.observers.push(callback);
    }

    /**
     * Navigate to a path and notify observers of URL change.
     * @param {String} path to navigate to
     */
    navigate(path) {
        const data = {}, title = '';

        window.history.pushState(data, title, path);
        this.notifyObservers();
    }

    getRouteName() {
        return window.location.pathname.split('/').pop();
    }

    getRoute() {
        return window.location.pathname;
    }
}

export { Navigator };