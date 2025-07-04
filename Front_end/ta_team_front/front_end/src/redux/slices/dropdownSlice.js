import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    accounts:[],
    endClients:[],
    clients:[],
    jobStatus:[],
    sources:[],
    roleTypes:[],
    employees:[]
}

const dropdownSlice = createSlice(
    {
        name:'master_dropdown',
        initialState,
        reducers:{
            setAccounts(state,action){
                state.accounts = action.payload;
            },
             setEndClients(state,action){
                state.endClients = action.payload;
            },
             setClients(state,action){
                state.clients = action.payload;
            },
             setJobStatus(state,action){
                state.jobStatus = action.payload;
            },
             setSources(state,action){
                state.sources = action.payload;
            },
             setRoleTypes(state,action){
                state.roleTypes = action.payload;
            },
             setEmployees(state,action){
                state.employees = action.payload;
            },
            setAccountManagers(state,action){
                state.accountManagers = action.payload;
            },
            setHiringManagers(state,action){
                state.hiringManagers = action.payload;
            }
            
        }
    }
);

export const{setAccounts,setEndClients,setClients,setJobStatus,setSources,setRoleTypes,setEmployees,setAccountManagers,setHiringManagers} = dropdownSlice.actions;
export default dropdownSlice.reducer;