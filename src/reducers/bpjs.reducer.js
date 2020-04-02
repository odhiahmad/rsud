import {combineReducers} from 'redux';

const bpjsData = (state = {}, action) => {
    switch (action.type) {
        case 'GET_DATA_BPJS':
            return {
                data: action.data,
            };
        default:
            return state;
    }
};
