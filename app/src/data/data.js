/**
 * @param {Response} res response object from fetch()
 */
export function readResponseText(res, callback) {
    res.text().then((val) => {
        callback(val);
    },
    (err) => console.log(err));
}

/**
 * @param {String} route route or url
 * @returns {URL} URL object to route/url
 */
export function parseCompleteURL(route) {
    const origin = window.location.origin;

    if (route.includes(origin)) {
        return new URL(route);
    }
    else {
        return new URL(origin + route);
    }
}

const DEFAULT_PROFILE_IMAGE_PATH = '/data/images/default.jpg';
export class Profile {

    /**
     * @param {JSON} obj containing profile information 
     */
    constructor(obj) {
        this.username = obj.username;
        this.imagePath = obj.imagePath;
        this.firstName = obj.personal.firstName;
        this.lastName = obj.personal.lastName;
        this.birthday = obj.personal.birthday;
        this.gender = obj.personal.gender;

        if (this.username == null) {this.username = 'despacito';}
        if (this.imagePath == null) {this.imagePath = DEFAULT_PROFILE_IMAGE_PATH;}
    }
}

/**
 * @param {String} route to request from
 * @param {Object} query object with queries in it
 */
export function constructFetch(route, query) {
    const origin = window.location.origin;
    const url = new URL(origin + route);

    url.search = new URLSearchParams(query);

    return url;
}

/**
 * 
 * @param {Response} res
 * @param {function(JSON):void} callback
 */
export function parseJSONFromResponse(res, callback) {
    res.json()
    .then((json) => {
        callback(json);
    });
}

/**
 * @param {String} name 
 * @param {function(Profile):void} callback 
 */
export function getProfile(name, callback) {
    const url = constructFetch('/user/profile', {"username": name});
    fetch(url)
    .then((response) => {
        parseJSONFromResponse(response, (json) => {
            const profile = new Profile(json);
            callback(profile);
        });
    });
}