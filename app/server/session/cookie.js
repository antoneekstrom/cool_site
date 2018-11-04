const SEPARATOR = '; ';

/**
 * @returns An object with cookies inside of it.
 */
module.exports.getCookies = function () {
    const unbakedcookies = document.cookie.split(SEPARATOR);
    let cookies = {};
    
    for (var val in unbakedcookies) {
        const c = val.split('=');
        cookies[c[0]] = c.pop();
    }
    console.log(document.cookie);
    return cookies;
}

module.exports.readCookie = function (key) {
    return this.getCookies()[key];
}

module.exports.addCookie = function (key, val) {
    document.cookie = `${key}=${val}`;
}