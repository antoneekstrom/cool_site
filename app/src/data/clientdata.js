import $ from "jquery";
import { setCookie, readCookie } from "./cookie";
import { getProfileUpdator } from "../app";

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

export const DEFAULT_PROFILE_IMAGE_PATH = '/data/images/default.jpg',
             SEPARATOR = '/',
             COOKIE_TOKEN_KEY = 'login_id'

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

export class Token {
    constructor(tokenobj) {
        this.id = tokenobj.id;
        this.username = tokenobj.username;
        this.expires = tokenobj.expires;
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
 * Also automatically uses token and applies it as a cookie.
 * @returns {Promise<JSON>} promise that resolves with a JSON containing info about logintoken
 * @param {String} username 
 * @param {String} password 
 */
export function login(username, password) {
    let url = constructFetch('/user/login', {username: username, password: password});

    return new Promise((resolve, reject) => {

        fetch(url)
        .then((val) => val.json().then((json) => {
            applyToken(new Token(json));
            getProfileUpdator().notifyObservers({});
            resolve(json);
        }));
    });
}

/**
 * @param {Token} token 
 */
export function applyToken(token) {
    setCookie(COOKIE_TOKEN_KEY, token.id);
}

export function getTokenFromCookies() {
    return readCookie(COOKIE_TOKEN_KEY);
}

/**
 * @returns {Promise<Profile>} profile that is currently logged,
 * if there is none it returns an empty object I think, or maybe null.
 * Test for both to be sure.
 */
export function getLoggedInProfile() {
    let q = {};
    q[COOKIE_TOKEN_KEY] = getTokenFromCookies();

    let url = constructFetch('/user/profile', q);

    return new Promise((resolve, reject) => {

        fetch(url)
        .then((res) => {

            if (res != null && res.body != null) {
                res.json().then((json) => {
                    let profile = new Profile(json);
                    resolve(profile);
                });    
            }
            else {
                resolve(null);
            }
        });
    });
}

export function searchDbByName(username) {
    return new Promise((resolve, reject) => {
        const url = constructFetch('/data/users', {username: username});
        fetch(url)
        .then((res) => res.json().then(json => {
            resolve(json);
        }));
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