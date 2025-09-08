// categoryActions.js
import api from '../api';

export const fetchCategories = () => async (dispatch) => {
    dispatch({ type: 'CATEGORIES_LOADING' });
    try {
        const categories = await api.get('/categories');
        dispatch({ type: 'CATEGORIES_SUCCESS', payload: categories.data });
    } catch (error) {
        dispatch({ type: 'CATEGORIES_ERROR', payload: error.message });
    }
};

export const addCategory = (categoryData) => async (dispatch) => {
    dispatch({ type: 'CATEGORIES_LOADING' });
    try {
        const response = await api.post('/categories', categoryData);
        dispatch({ type: 'ADD_CATEGORIES_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'CATEGORIES_ERROR', payload: error.message });
    }
};
