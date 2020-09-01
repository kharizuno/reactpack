import * as helper from '../helpers';
import * as ihttp from './initialHttp';
import fetch from 'isomorphic-fetch';
import serialize from 'serialize-javascript';

class HttpApi {

    static requestHeaders() {
        let token = helper.localStore('tokenize');
        return {
            'Access-Control-Allow-Origin': '*',
            'AUTHORIZATION': (token) ? 'JWT '+token.access_token : ''
        };
    }

    static requestUrl(acc, access) {
        if(acc === 'development') {
            switch(access) {
                case 'phx':
                    return ihttp.URL_PHOENIX_DEV;
                case 'bin':
                    return ihttp.URL_BINTARI_DEV;
                default:
                    return ihttp.URL_BINSOCX_DEV;
            }
        } else {
            switch(access) {
                case 'phx':
                    return ihttp.URL_PHOENIX_PROD;
                case 'bin':
                    return ihttp.URL_BINTARI_PROD;
                default:
                    return ihttp.URL_BINSOCX_PROD;
            }
        }
    }

    static callGet(uri, data, access) {
        const headers = Object.assign({'Content-Type': 'application/json'}, this.requestHeaders());
        const request = new Request(`${this.requestUrl(ihttp.API_ACCESS, access)}/${uri}${helper.objectString(data)}`, {
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }

    static callPost(uri, data, access) {
        const headers = Object.assign({'Content-Type': 'application/json'}, this.requestHeaders());
        const request = new Request(`${this.requestUrl(ihttp.API_ACCESS, access)}/${uri}`, {
            method: 'POST',
            headers: headers,
            body: serialize(data, {isJSON: true})
        });

        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }

    static callPut(uri, data, access) {
        const headers = Object.assign({'Content-Type': 'application/json'}, this.requestHeaders());
        const request = new Request(`${this.requestUrl(ihttp.API_ACCESS, access)}/${uri}`, {
            method: 'PUT',
            headers: headers,
            body: serialize(data, {isJSON: true})
        });

        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }

    static callDelete(uri, data, access) {
        const headers = Object.assign({'Content-Type': 'application/json'}, this.requestHeaders());
        const request = new Request(`${this.requestUrl(ihttp.API_ACCESS, access)}/${uri}`, {
            method: 'DELETE',
            headers: headers,
            body: serialize(data, {isJSON: true})
        });

        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default HttpApi;
