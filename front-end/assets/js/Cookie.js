class Cookie {

    //This method is used to set cookies values, 
    static setCookie(name = undefined, value = undefined, expires = undefined, path = undefined) {
        
        /*Checking data types for name=value in cookie, it will throw an error if they
        they are not valid data types
        */
        if(!name || !value)
            throw CookieError(`Cookie Name or Value undefined!`);
        if(typeof name !== `string` || typeof value !== `string`)
            throw CookieError(`Data type of cookie name or value not valid!`)
        
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

    //Method to get a cookie with a given name
    static getCookie(name = undefined) {
        console.log(`cookies`)
        console.log(document.cookie);
    }
}

//Class to throw cookies error
class CookieError extends Error {

    constructor(_message = "") {
        super(_message);
        this._message = _message;
    }
}