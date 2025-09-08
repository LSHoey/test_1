
const initialState = {
    user: null,
    loading: false,
    error: null
};

export default function UserReducer(state = initialState, action) {
    switch (action.type) {
        case 'USER_LOADING':
            return { ...state, loading: true, error: null };
        case 'USER_LOGIN_SUCCESS':
            return { ...state, loading: false, user: action.payload.user, error: null, };
        case 'USER_REGISTER_SUCCESS':
            return { ...state, loading: false, user: action.payload.user, error: null, };
        case 'USER_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'USER_LOGOUT':
            return { ...state, user: null, token: null, error: null };
        default:
            return state;
    }
}
