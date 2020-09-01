import * as helper from '../helpers';
import * as ihttp from './initialHttp';
import axios from 'axios';
import http from 'http';
import https from 'https';
import serialize from 'serialize-javascript';

class HttpApi {

    static requestHeaders() {
        let token = helper.localStore('tokenize');
        axios.defaults.headers.common['Authorization'] = (token) ? 'JWT '+token.access_token : '';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    static requestConfig() {
        return {
            httpAgent: new http.Agent({keepAlive: true}),
            httpsAgent: new https.Agent({keepAlive: true})
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
        this.requestHeaders();
        return axios.get(`${this.requestUrl(ihttp.API_ACCESS, access)}/${uri}`, {params: data}, this.requestConfig())
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
    }

    static callPost(uri, data, access) {
        this.requestHeaders();
        return axios.post(`${this.requestUrl(ihttp.API_ACCESS, access)}/${uri}`, serialize(data, {isJSON: true}), this.requestConfig())
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
    }

    static callPut(uri, data, access) {
        this.requestHeaders();
        return axios.put(`${this.requestUrl(ihttp.API_ACCESS, access)}/${uri}`, serialize(data, {isJSON: true}), this.requestConfig())
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
    }

    static callDelete(uri, data, access) {
        this.requestHeaders();
        return axios.delete(`${this.requestUrl(ihttp.API_ACCESS, access)}/${uri}`, serialize(data, {isJSON: true}), this.requestConfig())
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
    }
}

export default HttpApi;
