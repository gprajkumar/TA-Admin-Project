import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    username: null,
    employee_details: null,
    isAuthenticated:false,
    employee_authorization:null
};

const authSlice = createSlice(
    {
        name:'auth_user',
        initialState,
        reducers:{
            setEmployee(state,action){
      const {is_active,emp_details} = action.payload;
      state.username = emp_details.email_id,
      state.employee_details = emp_details,
      state.isAuthenticated = is_active
      state.employee_authorization = emp_details.designation

  
        },
        clearEmployee(state){
        state.username = null,
      state.employee_details = null,
      state.isAuthenticated = null,
       state.employee_authorization = null
        }

    },
}
);
export const{setEmployee,clearEmployee} = authSlice.actions;
export default authSlice.reducer;