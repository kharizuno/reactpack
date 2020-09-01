import * as helper from '../helpers';
import fetch from 'isomorphic-fetch';
import serialize from 'serialize-javascript';

class HttpApi {

    static requestHeaders() {
        return {
            'Access-Control-Allow-Origin': '*',
            'Authorization': ''
        };
    }

    static requestUrl(access) {
        switch(access) {
            default:
                return process.env.REACT_APP_URL_API;
        }
    }

    static callGet(uri, data, access) {
        const headers = Object.assign({'Content-Type': 'application/json'}, this.requestHeaders());
        const request = new Request(`${this.requestUrl(access)}/${uri}${helper.objectString(data)}`, {
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return {error: true, message: error};
        });
    }

    static callPost(uri, data, access, multipart) {
        const headers = Object.assign({'Content-Type': 'application/json'}, this.requestHeaders());
        if (multipart) delete headers['Content-Type'];
        
        const request = new Request(`${this.requestUrl(access)}/${uri}`, {
            method: 'POST',
            headers: headers,
            body: (multipart) ? data : serialize(data, {isJSON: true}),
            progress: (e) => { 
                if (multipart) {
                    console.log(`Progress: ${e.loaded/e.total}%`);
                    // multipart.actprogress.loadProgress(e.loaded/e.total); 
                }
            }
        });

        return fetch(request).then(response => {
            if (multipart && multipart.progress === 100) {
                // multipart.actprogress.loadProgress(false); 
            }

            return response.json();
        }).catch(error => {
            return {error: true, message: error};
        });
    }

    static callPut(uri, data, access, multipart) {
        const headers = Object.assign({'Content-Type': 'application/json'}, this.requestHeaders());
        if (multipart) delete headers['Content-Type'];

        const request = new Request(`${this.requestUrl(access)}/${uri}`, {
            method: 'PUT',
            headers: headers,
            body: (multipart) ? data : serialize(data, {isJSON: true}),
            progress: (e) => { 
                if (multipart) {
                    console.log(`Progress: ${e.loaded/e.total}%`);
                    // multipart.actprogress.loadProgress(e.loaded/e.total); 
                }
            }
        });

        return fetch(request).then(response => {
            if (multipart && multipart.progress === 100) {
                // multipart.actprogress.loadProgress(false); 
            }

            return response.json();
        }).catch(error => {
            return {error: true, message: error};
        });
    }

    static callDelete(uri, data, access) {
        const headers = Object.assign({'Content-Type': 'application/json'}, this.requestHeaders());
        const request = new Request(`${this.requestUrl(access)}/${uri}`, {
            method: 'DELETE',
            headers: headers,
            body: serialize(data, {isJSON: true})
        });

        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return {error: true, message: error};
        });
    }
}

export default HttpApi;
