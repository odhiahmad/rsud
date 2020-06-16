import {baseApi, baseApiBpjs, fetchApi} from '../service/api';
import {Actions} from 'react-native-router-flux';
import messaging from '@react-native-firebase/messaging';

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

                fetch(baseApi + '/user/updateStatusLogin', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + response.responseBody.token,
                    },
                    body: JSON.stringify({
                        id: response.responseBody.id,
                    }),
                }).then((response) => response.json()).then((responseJson) => {
                    console.log('Success');
                });


                dispatch({
                    type: 'LOGIN_USER_SUCCESS',
                });
                dispatch({
                    type: 'AUTH_USER_SUCCESS',
                    token: response.responseBody.token,
                    status: response.responseBody.status,
                });
                dispatch({
                    type: 'GET_USER_SUCCESS',
                    payload: response.responseBody,
                });
                console.log(response.responseBody.status);

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

export const getDataBPJS = (payload1, payload2) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: 'GET_DATA_BPJS_LOADING',
            });
            const url = baseApiBpjs + 'peserta_bpjs';
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': '00004',
                    'password': '551UU1BJ',
                    'param': payload1,
                    'data': payload2,
                }),
            }).then((response) => response.json()).then((responseJson) => {

                if (responseJson.response != null) {
                    if (parseInt(responseJson.response.peserta.statusPeserta.kode) === 0) {
                        dispatch({
                            type: 'GET_DATA_BPJS',
                            data: responseJson.response,
                        });
                        throw responseJson.response;
                    } else {
                        dispatch({
                            type: 'GET_DATA_BPJS',
                            data: responseJson.response,
                        });
                        throw responseJson.response;
                    }

                } else {
                    dispatch({
                        type: 'GET_DATA_BPJS',
                        data: responseJson.response,
                    });

                    throw responseJson.response;
                }


            }).catch((error) => {
                console.log(error);
                this.state.loading = false;
            });

        } catch (error) {
            dispatch({
                type: 'GET_DATA_BPJS_FAILED',
                payload: error.responseBody,
            });
            return error;
        }
    };
};


export const logoutUser = (userId) => {
    return async (dispatch, getState) => {
        const state = getState();
        try {
            const {authReducer: {authData: {token}}} = state;
            const tokenData = state.userReducer.getUser.userDetails.token;

            if (tokenData === null) {
                dispatch({
                    type: 'USER_LOGGED_OUT_SUCCESS',
                });
            } else {
                fetch(baseApi + '/user/logout', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: userId,
                    }),

                }).then((response) => response.json()).then((responseJson) => {
                    console.log(responseJson);
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

export const lengkapiDataUser = () => {
    return async (dispatch) => {
        dispatch({
            type: 'GET_USER_SUCCESS',
            status: false,
        });
    };
};
