// userActions.js
import api from '../api';

export const loginUser = (credentials) => async (dispatch) => {
    dispatch({ type: 'USER_LOADING' });
    try {
        const response = await api.post('/login', credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: { token, user } });
        return response;
    } catch (error) {
        console.log(error);
        dispatch({ type: 'USER_ERROR', payload: error.response.data.message });
    }
}

export const registerUser = (data) => async (dispatch) => {
    dispatch({ type: 'USER_LOADING' });
    try {
        const response = await api.post('/register', data);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'USER_REGISTER_SUCCESS', payload: { token, user } });
        return response;
    } catch (error) {
        dispatch({ type: 'USER_ERROR', payload: error.response.data.message });
    }
}

export const logoutUser = () => async (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: 'USER_LOGOUT' });
}