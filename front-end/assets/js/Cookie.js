class Cookie {

    //This method is used to set cookies values, 
    static setCookie(name = undefined, value = undefined, expires = undefined, path = undefined) {
        
        /*Checking data types for name=value in cookie, it will throw an error if they
        they are not valid data types
        */
        if(!name || !value)
            throw new CookieError(`Cookie Name or Value undefined!`);
        if(typeof name !== `string` || typeof value !== `string`)
            throw new CookieError(`Data type of cookie name or value not valid!`)
        
        //Value of new_cookie
        let new_cookie = `${name}=${value};`;
        
        //Checking if it has an expires date
        if(expires && (typeof expires === `number`) && expires >= 0) {
            const time = new Date();
            let actual_time = time.getTime();//Get the current time
            let expire_time = actual_time + expires * 1000;//Passing time to milliseconds
            time.setTime(expire_time);
            new_cookie += ` expires=${time.toUTCString()};`;
        }

        //Checking if it has a path value
        if(path && typeof path === `string`)
            new_cookie += ` path=${path};`;
        else
            new_cookie += ` path=/;`;

        //Saving cookie
        document.cookie = new_cookie;
    }

    //Method to get a all cookies with a key value format
    static getListCookie() {
        //Getting an array of cookies
        const cookies_array = document.cookie.split(`;`);
        
        const cookies_key_values = cookies_array.map((cookie, _index) => {
            let [cookie_key, cookie_value] = cookie.split(`=`);
            if (_index > 0)
                cookie_key = cookie_key.slice(1);
            return {
                cookie_key,
                cookie_value,
            };
        });
        
        return cookies_key_values;
    }

    //Returns pair key value of cookie if exists, or return undefined if it is not
    static getCookie(name_cookie = undefined) {
        const list_cookies = Cookie.getListCookie();

        if(!name_cookie)
            throw new CookieError(`getCookie: parameter name_cookie is undefined`);
        if(typeof name_cookie !== `string`)
            throw new CookieError(`getCookie: parameter name_cookie is not of string type`);

        const cookie = list_cookies.find(({cookie_key, cookie_value}) => cookie_key === name_cookie);

        return cookie;

    }


}

//Class to throw cookies error
class CookieError extends Error {

    constructor(_message = "") {
        super(_message);
        this._message = _message;
    }
}