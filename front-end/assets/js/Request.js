//Class to make web request, its a wrapper
class Request {

    static csrf_token = `X-CSRFToken`;
    static #URL_CSRF_TOKEN = `http://localhost:8000/token/csrf_token/`
    /**
     * 
     * @param {String} _url - Url to hit in web request
     * @param {String} _method - Method to use in web request
     * @param {Object} _body - Data which will be used in request body
     *
     */
    constructor(_url = undefined, _body = {}) {
        this._url = _url;
        this._body = _body;
        this._headers = {};
    }

    //--------------- Static methods -----------------
    static checkXCSRFToken() {
        return Cookie.getCookie(Request.csrf_token) ? true : false;
    }

    static obtainXCSRFToken() {
        fetch(Request.#URL_CSRF_TOKEN).
        then(res => res.json())
        .then(({token, expire}) => 
        {
            Cookie.setCookie(`X-CSRFToken`, token)
            Cookie.setCookie(`csrftoken`, token)
        })
        .catch(err =>{
            console.error(err);
            throw new RequestError("obtainXCSRFToken Error: Fetching X-CSRFToken has failed");
        });
    }
    //--------------- End Static methods -------------
    
    //Setter and getter for url endpoint
    set url(_url) {
        this._url = _url;
    }

    get url() {
        return this._url;
    }

    //Method to add headers to request
    setHeader(_header_name = undefined, _header_value = undefined) {

        if(!_header_name || !_header_value)
            throw new RequestError(`setHeader Error: _header_name or _header_value is undefined!`)
        if(typeof _header_name !== `string` || typeof _header_value !== `string`)
        throw RequestError(`setHeader Error: _header_name or _header_value data type is incorrect!`)

        this._headers[_header_name] = _header_value;
    }

    //Get specific list of header passed as parameter
    getHeader(_name_header){
        if(!_header_name)
        throw RequestError(`getHeader Error: _header_name is undefined!`)
        if(typeof _header_name !== `string`)
            throw RequestError(`getHeader Error: _header_name data type is incorrect!`)

        return this._headers[_name_header];
    }
    //Get full list of headers
    get headers(){
        const clone_headers = Object.assign({}, this._headers);
        return clone_headers;
    }

    //This method clear all headers present in request
    clearHeaders() {
        this._headers = {};
    }

    //Method to obtain body
    setBody(_body){
        this._body = _body; 
    }

    //Method to obtain body
    get body(){
        return this._body;
    }

    //Clear the body with this method
    clearBody(){
        this._body = {};
    }

    //Get method to retrieve info
    get = () => {

        //TO-DO
    }

    //Post method to send information to backend
    post = (json = true) => {
        let res = undefined;

        if (!Request.checkXCSRFToken())
            Request.obtainXCSRFToken();
        
        return new Promise((resolve, reject) => {
            const cookie_tries = 0;

            const id_interval = setInterval(()=> {
                try{
                    const {cookie_value} = Cookie.getCookie(Request.csrf_token);
                    if (cookie_value){
                        clearInterval(id_interval);
                        resolve(cookie_value);                   
                    }
                } catch(error)
                {
                    if(cookie_tries > 10)
                        reject(`post Error: CSRFToken cookie is not available after several tries!`);
                    console.error(`Cookie still no available`);
                }

                }, 20);
            }).then(cookie_value => {
                this.setHeader(Request.csrf_token, cookie_value);

                if(json)
                {
                    this._body = JSON.stringify(this._body);
                    this.setHeader(`Content-Type`, `application/json`   )
                }
        
                const response = fetch(this._url, {
                    method: `POST`,
                    headers: {
                        ...this._headers
                    },
                    credentials: `include`,
                    body: this._body,
                })
        
                return response;

            }).catch(error => {
                throw new Request(`${error}`);
            });

    }

}//End Request class

//------------------------------------------------------
//Class for custom Request erros
class RequestError extends Error {

    constructor(_message) {
        super(_message);
        this._message;
    }
}