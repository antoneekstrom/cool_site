const SEPARATOR = '; ';

/**
 * @returns An object with cookies inside of it.
 */
export function getCookies() {
    const unbakedcookies = document.cookie.split(SEPARATOR);
    let cookies = {};

    for (let i = 0; i < unbakedcookies.length; i++) {
        let val = unbakedcookies[i];
        let c = val.split('=');
        cookies[c[0]] = c.pop();
    }
    return cookies;
}

export function readCookie(key) {
    let cookies = getCookies();
    return cookies[key];
}

export function setCookie(key, val) {
    document.cookie = `${key}=${val}`;
}