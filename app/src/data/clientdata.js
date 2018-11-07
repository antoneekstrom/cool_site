import $ from "jquery";

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

const DEFAULT_PROFILE_IMAGE_PATH = '/data/images/default.jpg', SEPARATOR = '/';
export class Profile {
    /**
     * @param {JSON} obj containing profile information 
     */
    constructor(obj) {
        this.username = obj.username;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.birthDay = obj.birthDay;
        this.birthMonth = obj.birthMonth;
        this.birthYear = obj.birthYear;
        this.gender = obj.gender;
        this.imagePath = obj.imagePath;

        if (this.username == null) {this.username = 'despacito';}
        if (this.imagePath == null) {this.imagePath = DEFAULT_PROFILE_IMAGE_PATH;}
    }
    getBirthdayAsDate() {
        return getDate(this.birthDay, this.birthMonth, this.birthYear);
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

export function getDate(day, month, year) {
    return day + SEPARATOR + month + SEPARATOR + year;
}

/**
 * String will be obscured by DOING NOTHING. Yeah. It just kind of looks bad to send a password in plaintext y'know.
 * @param {String} text to obscure
 * @returns {String} epic string
 */
export function obscureString(text) {
    return text;
}

export function getUsernameFromURL() {
    let url = new URL(window.location.href);
    return url.searchParams.get('username');
}

/**
 * epic
 * @param {String} text 
 */
export function unobscureString(text) {
    return text;
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

export function createUser(firstname, lastname, birthdate, username, password) {
    return new Promise((resolve, reject) => {
        $.post(window.location.origin + '/user/create', {
            username: username,
            firstname: firstname,
            lastname: lastname,
            birthdate: birthdate,
            password: password
        },
        (data) => {
            resolve(data);
        });
    });
}

/**
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
 * @returns {Boolean} if user is logged in
 */
export function isLoggedIn() {
    return false;
}

export function login(username, password) {
    let url = constructFetch('/user/login', {username: username, password: password});
    return fetch(url);
}

export function getLoggedInProfile() {
    return 'despacito';
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