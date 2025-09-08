// productActions.js
import api from '../api';

export const fetchProducts = (params = {}) => async (dispatch) => {
    dispatch({ type: 'PRODUCTS_LOADING' });
    try {
        const query = new URLSearchParams();
        if (params.category_id) query.append('category_id', params.category_id);
        if (params.enabled !== undefined) query.append('enabled', params.enabled);
        if (params.page) query.append('page', params.page);
        if (params.per_page) query.append('per_page', params.per_page);

        const products = await api.get(`/products?${query.toString()}`);
        dispatch({ type: 'PRODUCTS_SUCCESS', payload: products.data });
    } catch (error) {
        dispatch({ type: 'PRODUCTS_ERROR', payload: error.message });
    }
};

export const addProduct = (productData) => async (dispatch) => {
    try {
        const response = await api.post('/products', productData);
        return response;

    } catch (error) {
        dispatch({ type: 'PRODUCTS_ERROR', payload: error.message });
    }
};

export const deleteProduct = (selectedIds) => async (dispatch) => {
    dispatch({ type: 'PRODUCTS_LOADING' });
    try {
        const response = await api.delete(`/products`, { data: { ids: selectedIds } });
        if (response.status !== 200) {
            return;
        } else {
            dispatch({ type: 'DELETE_PRODUCTS_SUCCESS', payload: selectedIds });
        }
    } catch (error) {
        dispatch({ type: 'PRODUCTS_ERROR', payload: error.message });
    }
};

export const exportProducts = (selectedIds = []) => async () => {
    try {
        const query = selectedIds.length > 0 ? `?ids=${selectedIds.join(',')}` : '';
        const response = await api.get(`/products-export${query}`, {
            responseType: 'blob'
        });

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', selectedIds.length ? 'selected_products.xlsx' : 'all_products.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export failed:', error);
    }
};
