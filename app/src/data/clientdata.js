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
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.birthDay = obj.birthDay;
        this.birthMonth = obj.birthMonth;
        this.birthYear = obj.birthYear;
        this.gender = obj.gender;

        if (this.username == null) {this.username = 'despacito';}
        if (this.imagePath == null) {this.imagePath = DEFAULT_PROFILE_IMAGE_PATH;}
    }
    getBirthdayAsDate() {
        const SEPARATOR = '/';
        return this.birthDay + SEPARATOR + this.birthMonth + SEPARATOR + this.birthYear;
    }
    getProfileAsObject() {
        let obj = {
            'username': this.username,
            'imagePath': this.imagePath,
            'firstName': this.firstName,
            'lastName': this.lastName,
            'birthDay': this.birthDay,
            'birthMonth': this.birthMonth,
            'birthYear': this.birthYear,
            'birthDate': this.getBirthdayAsDate(),
            'gender': this.gender,
        };
        return obj;
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