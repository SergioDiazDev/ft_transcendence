//Class to make web request, its a wrapper
class Request {

    /**
     * 
     * @param {String} _url - Url to hit in web request
     * @param {String} _method - Method to use in web request
     * @param {Object} _body - Data which will be used in request body
     *
     */
    constructor(_url = undefined, _method = undefined, _body = {}) {
        this._url = _url;
        this._method = _method;
        this._body = _body;
    }

    //--------------- Static methods -----------------
    static checkXCSRFToken() {
        Cookie.setCookie("sasdasdasdsadasdasd3123123g12hb3v", 86400);  
        Cookie.getCookie("asdas")

    }

    //Setter and getter for url endpoint
    set url(_url) {
        this._url = _url;
    }

    get url() {
        return this._url;
    }

    //Setter and getter for method to use
    set method(_method) {
        this._method = _method;
    }

    get method() {
        return this._method;
    }

    //Get method to retrieve info
    Get = () => {

        //TO-DO
    }

    //Post method to send information to backend
    Post = () => {
        console.log(Request.checkXCSRFToken());
        /*
        if (Request.checkXCSRFToken()) {
            console.log(`We have token...`)
        }else
        {
            //To-Do
        }
        */
    }
}