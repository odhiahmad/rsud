import {baseApi, fetchApi} from '../service/api';

export const createNewUser = (payload) => {
    return async (dispatch) => {

        try {
            dispatch({
                type: 'CREATE_USER_LOADING',
            });
            const response = await fetchApi('/user/create', 'POST', payload, 200);

            if (response.success === true) {
                dispatch({
                    type: 'CREAT_USER_SUCCESS',
                });
                dispatch({
                    type: 'AUTH_USER_SUCCESS',
                    token: response.token,
                });
                dispatch({
                    type: 'GET_USER_SUCCESS',
                    payload: response.responseBody,
                });

                return response;
            } else if (response.success === false) {
                throw response;
            }

        } catch (error) {
            dispatch({
                type: 'CREAT_USER_FAIL',
                payload: error.responseBody,
            });
            return error;
        }
    };
};

export const loginUser = (payload) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: 'LOGIN_USER_LOADING',
            });
            const response = await fetchApi('/user/login', 'POST', payload, 200);

            if (response.success) {
                dispatch({
                    type: 'LOGIN_USER_SUCCESS',
                });
                dispatch({
                    type: 'AUTH_USER_SUCCESS',
                    token: response.token,
                });
                dispatch({
                    type: 'GET_USER_SUCCESS',
                    payload: response.responseBody,
                });
                return response;
            } else {
                throw response;
            }

        } catch (error) {
            dispatch({
                type: 'LOGIN_USER_FAIL',
                payload: error.responseBody,
            });
            return error;
        }
    };
};


export const logoutUser = () => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const {authReducer: {authData: {token}}} = state;
            const tokenData = state.userReducer.getUser.userDetails.token;

            if(tokenData === null){
                dispatch({
                    type: 'USER_LOGGED_OUT_SUCCESS',
                });
            }else{
                fetch(baseApi + '/user/logout', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: tokenData,
                    }),

                }).then((response) => response.json()).then((responseJson) => {
                    if (responseJson.success === true) {
                        dispatch({
                            type: 'USER_LOGGED_OUT_SUCCESS',
                        });
                    } else {
                        return responseJson;
                    }

                })
                    .catch((error) => {
                        console.log(error);
                    });
            }



        } catch (e) {

        }
    };
};
