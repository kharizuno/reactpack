import * as types from '../../constants/InitialType';
import initialState from '../../constants/initialState';

let data = {
    loading: false,
    samplelist: initialState.samplelist
};

const sampleReducer = (state = data, action) => {
    switch (action.type) {
        case types.CLEAR_SAMPLE:
            state = {
                ...state,
                loading: true,
                samplelist: []
            }
            break;
        case types.LOAD_SAMPLE:
            let samplelist = action.payload;
            if (Object.keys(state.samplelist).length > 0) {
                samplelist = state.samplelist;
                
                if (action.multiple && action.multiple.type)
                samplelist[action.multiple.type] = action.payload;
            } else {
                if (action.multiple && action.multiple.type)
                samplelist = {[action.multiple.type]: action.payload}
            }
            
            state = {
                ...state,
                loading: true,
                samplelist: samplelist
            }            
            break;    

        default:
    }

    return state;
}

export default sampleReducer;
