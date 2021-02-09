import axios from 'axios';
import http from 'http';
import https from 'https';
import serialize from 'serialize-javascript';

class HttpApi {

    static requestHeaders(multipart) {
        axios.defaults.headers.common['Authorization'] = '';

        if (!multipart) axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
    }

    static requestConfig(cancelToken) {
        let config = {
            httpAgent: new http.Agent({keepAlive: true}),
            httpsAgent: new https.Agent({keepAlive: true})
        }

        if (cancelToken) Object.assign(config, {cancelToken: cancelToken})
        return config;
    }
    
    static requestUrl(access) {
        switch(access) {
            case 'site':
                return process.env.REACT_APP_URL_SITE;
            default:
                return process.env.REACT_APP_URL_API;
        }
    }

    static callGet(uri, data, access, cancelToken) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders();
        return axios.get(`${this.requestUrl(access)}/${uri}`, {params: data, cancelToken: cancelToken}, this.requestConfig())
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            let msg = {error: true, message: error.message};
            if (error.response.data) Object.assign(msg, error.response.data);

            if (axios.isCancel(error)) {
                Object.assign(msg, {unmount: true});

                if (process.env.NODE_ENV === 'development')
                console.log("Request cancelled", error.message);
            }

            return msg;
        });
    }

    static callPost(uri, data, access, multipart, cancelToken) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders(multipart);
        return axios.post(`${this.requestUrl(access)}/${uri}`, serialize(data, {isJSON: true}), this.requestConfig(cancelToken))
        .then(function (response) {
            if (multipart && multipart.progress === 100) {
                // multipart.actprogress.loadProgress(false); 
            }

            return response.data;
        })
        .catch(function (error) {
            let msg = {error: true, message: error.message};
            if (error.response.data) Object.assign(msg, error.response.data);

            if (axios.isCancel(error)) {
                Object.assign(msg, {unmount: true});

                if (process.env.NODE_ENV === 'development')
                console.log("Request cancelled", error.message);
            }

            return msg;
        });
    }

    static callPut(uri, data, access, multipart, cancelToken) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders(multipart);
        return axios.put(`${this.requestUrl(access)}/${uri}`, serialize(data, {isJSON: true}), this.requestConfig(cancelToken))
        .then(function (response) {
            if (multipart && multipart.progress === 100) {
                // multipart.actprogress.loadProgress(false); 
            }

            return response.data;
        })
        .catch(function (error) {
            let msg = {error: true, message: error.message};
            if (error.response.data) Object.assign(msg, error.response.data);

            if (axios.isCancel(error)) {
                Object.assign(msg, {unmount: true});

                if (process.env.NODE_ENV === 'development')
                console.log("Request cancelled", error.message);
            }

            return msg;
        });
    }

    static callDelete(uri, data, access, cancelToken) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders();
        return axios.delete(`${this.requestUrl(access)}/${uri}`, serialize(data, {isJSON: true}), this.requestConfig(cancelToken))
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            let msg = {error: true, message: error.message};
            if (error.response.data) Object.assign(msg, error.response.data);

            if (axios.isCancel(error)) {
                Object.assign(msg, {unmount: true});

                if (process.env.NODE_ENV === 'development')
                console.log("Request cancelled", error.message);
            }

            return msg;
        });
    }
}

export default HttpApi;
