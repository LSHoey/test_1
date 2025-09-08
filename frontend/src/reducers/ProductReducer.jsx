// ProductReducer.jsx

const initialState = {
    products: [],
    loading: false,
    error: null
};

export default function ProductReducer(state = initialState, action) {
    switch (action.type) {
        case 'PRODUCTS_LOADING':
            return { ...state, loading: true, error: null };
        case 'ADD_PRODUCTS_SUCCESS':
            return {
                ...state, loading: false, products: { ...state.products, data: [...state.products?.data, action.payload] }
            };
        case 'PRODUCTS_SUCCESS':
            return { ...state, loading: false, products: action.payload ?? [] };
        case 'DELETE_PRODUCTS_SUCCESS':
            return { ...state, loading: false, products: { ...state.products, data: state.products.data.filter(product => !action.payload.includes(product.id)) } };
        case 'PRODUCTS_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}
