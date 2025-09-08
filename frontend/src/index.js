import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./reducers/UserReducer";
import ProductReducer from "./reducers/ProductReducer";
import CategoryReducer from "./reducers/CategoryReducer";
import reportWebVitals from './reportWebVitals';

const store = configureStore({
  reducer: {
    user: UserReducer,
    products: ProductReducer,
    categories: CategoryReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
