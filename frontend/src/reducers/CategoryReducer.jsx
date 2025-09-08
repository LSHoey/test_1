// CategoryReducer.jsx

const initialState = {
    categories: [],
    loading: false,
    error: null
};

export default function CategoryReducer(state = initialState, action) {
    switch (action.type) {
        case 'CATEGORIES_LOADING':
            return { ...state, loading: true, error: null };
        case 'CATEGORIES_SUCCESS':
            return { ...state, loading: false, categories: action.payload };
        case 'ADD_CATEGORIES_SUCCESS':
            return { ...state, loading: false, categories: [...state.categories, action.payload.category] };
        case 'CATEGORIES_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}
