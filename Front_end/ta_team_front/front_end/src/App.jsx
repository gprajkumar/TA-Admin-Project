import { useState,useEffect } from 'react'
import Header from './components/Header'
import axios from "axios";
import './index.css'
import {Routes,Route} from 'react-router-dom'
import Submission from './components/Submissions'
import AllRequirements from './components/AllRequirements'
import OfferForm from './components/OfferForm'
import AllSubmissions from './components/AllSubmissions'
import SubmissionDatesForm from './components/SubmissonDatesForm'
import AllSubmissionDates from './components/AllSubmissionDates'
import Login from './components/Login'
import { useNavigate } from 'react-router-dom';
import TAHomePage from './components/TAHomePage';
import RequirementForm from './components/RequirementForm';
import AuthCheck from './components/AuthCheck';
import store from './redux/store';
import {useDispatch} from 'react-redux'
import MyProfile from './components/myProfile';
import { setEmployee,clearEmployee } from './redux/slices/authSlice';
import {getAccounts,getClients,getEndClients,getJobStatuses,getSources,getRoleTypes,getEmployees, getAccountManagers, getHiringManagers} from './services/drop_downService.js';
import {setAccounts,setEndClients,setClients,setJobStatus,setSources,setRoleTypes,setEmployees,setHiringManagers,setAccountManagers} from './redux/slices/dropdownSlice';
function App() {
  const dispatch = useDispatch();
const navigate = useNavigate(); 
const [userDetails, setUserDetails] = useState(null);
const baseurl = import.meta.env.VITE_API_BASE_URL;
  // If token exists, get user info
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const name = localStorage.getItem('username');
    if (token && name) {
      setUserDetails({ empName: name });
    }
  }, []);
const handleLogout = () =>
{
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
  setUserDetails(null);
  dispatch(clearEmployee())
  navigate('/login');

}
  const handleLogin = async ({ email, password }) => {
    
    try {
      const response = await axios.post(`${baseurl}/api/login/`, {
        username: email,
        password:password,
      });

      const { access, refresh,is_active,emp_details } = response.data;
        if (!is_active) {
      return { success: false, message: 'User account is inactive.Please contact Administrator' };
    }
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('username', email);
      
     

      setUserDetails({ empName: email });
      
      navigate('/allsubmissions');
      console.log(response.data);
      dispatch(setEmployee(response.data))
      setTimeout(() => {
      fetchDropdowns(); // No await here — fire and forget
    }, 100);

      return { success: true };
      
    } catch (err) {
       const backendMessage = err?.response?.data?.detail || 
                           err?.response?.data?.non_field_errors?.[0] || 
                           'Invalid username or password';
      return { success: false,  message: backendMessage };
    }
};
const fetchDropdowns = async () => {
  try {
    const [accountData, endClientData,clientData,jobstatusData,sourceData,roleTypeData,employeeData,accountManagersData,HiringManagersData] = await Promise.all([
      getAccounts(),
      getEndClients(),
      getClients(),
      getJobStatuses(),
      getSources(),
      getRoleTypes(),
      getEmployees(),
      getAccountManagers(),
      getHiringManagers()
    ]);

    dispatch(setAccounts(accountData));
    dispatch(setEndClients(endClientData));
    dispatch(setClients(clientData));
    dispatch(setJobStatus(jobstatusData));
    dispatch(setSources(sourceData));
    dispatch(setRoleTypes(roleTypeData));
    dispatch(setEmployees(employeeData));
    dispatch(setAccountManagers(accountManagersData));
    dispatch(setHiringManagers(HiringManagersData));
  } catch (err) {
    console.error('Dropdown fetch failed:', err.message);
  }
};
  return (
    <>
   
 <Header userdetails={userDetails} onSignOut={handleLogout}/>
<Routes>
  <Route path='/' element={<TAHomePage/>}/>
  <Route path='/addrequirements' element={<AuthCheck><RequirementForm/></AuthCheck>}/>
  <Route path='/submissions' element={<AuthCheck><Submission/></AuthCheck>}/>
   <Route path='/allreqs' element={<AuthCheck><AllRequirements/></AuthCheck>}/>
    <Route path='/filledjob' element={<AuthCheck><OfferForm/></AuthCheck>}/>
    <Route path='/allsubmissions' element={<AuthCheck><AllSubmissions/></AuthCheck>}/>
     <Route path='/submissionsDateEntry' element={<AuthCheck><SubmissionDatesForm/></AuthCheck>}/>
  <Route path='/submissionsDateDetails' element={<AuthCheck><AllSubmissionDates/></AuthCheck>}/>
   <Route path='/myprofile' element={<AuthCheck><MyProfile/></AuthCheck>}/>
   <Route path='/login' element={<Login onLogin={handleLogin}/>}/>
</Routes>

 </>
  )
}

export default App
