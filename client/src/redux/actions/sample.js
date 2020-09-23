import {AWAIT_MARKER} from 'redux-await';

import * as types from '../../constants/InitialType';
import * as ihttp from '../../constants/initialHttp';
import HttpApi from '../../api';

export const clearSample = (dt, state) => async (dispatch) => {
    dispatch({type: types.CLEAR_SAMPLE, AWAIT_MARKER, payload: dt, multiple: state});
}

export function loadSampleHttp(dt, wait, timer) {
    return HttpApi.callPost(ihttp.URI_SAMPLE, dt).then(dt => {
        if (wait) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(dt);
                }, timer);
            });
        } else {
            return dt;
        }
    }).catch(err => {
        throw(err);
    });
}

export const loadSample = (dt, wait, timer = 1000, state) => async (dispatch) => {
    let data = await loadSampleHttp(dt, wait, timer);
    dispatch({type: types.LOAD_SAMPLE, AWAIT_MARKER, payload: data, multiple: state});

    return data;
}
