import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dropdownReducer from './slices/dropdownSlice';

const store = configureStore(
    {
        reducer:{
            employee:authReducer,
            master_dropdown:dropdownReducer,
        }
        }
    
);
export default store;