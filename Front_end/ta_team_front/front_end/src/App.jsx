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

function App() {
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

  const handleLogin = async ({ email, password }) => {
    console.log(email + password)
    try {
      const response = await axios.post(`${baseurl}/api/login/`, {
        username: email,
        password:password,
      });

      const { access, refresh,is_active } = response.data;
        if (!is_active) {
      return { success: false, message: 'User account is inactive.Please contact Administrator' };
    }
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('username', email);

      setUserDetails({ empName: email });
      navigate('/allsubmissions');
      return { success: true };
      
    } catch (err) {
       const backendMessage = err?.response?.data?.detail || 
                           err?.response?.data?.non_field_errors?.[0] || 
                           'Invalid username or password';
      return { success: false,  message: backendMessage };
    }
};
  return (
    <>
 <Header userdetails={userDetails} onSignOut={() => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
  setUserDetails(null);
  navigate('/login');}}/>
<Routes>
  <Route path='/' element={<TAHomePage/>}/>
  <Route path='/addrequirements' element={<RequirementForm/>}/>
  <Route path='/submissions' element={<Submission/>}/>
   <Route path='/allreqs' element={<AllRequirements/>}/>
    <Route path='/filledjob' element={<OfferForm/>}/>
    <Route path='/allsubmissions' element={<AllSubmissions/>}/>
     <Route path='/submissionsDateEntry' element={<SubmissionDatesForm/>}/>
  <Route path='/submissionsDateDetails' element={<AllSubmissionDates/>}/>
   <Route path='/login' element={<Login onLogin={handleLogin}/>}/>
</Routes>

 </>
  )
}

export default App
