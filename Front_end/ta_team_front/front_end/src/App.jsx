import { useState,useEffect, useRef } from 'react'
import Header from './components/Header'
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
import {persistor} from './redux/store';
import {useDispatch} from 'react-redux'
import ClientDashboard from './components/dashboards/ClientDashboard.jsx';
import MyProfile from './components/myProfile';
import ComingSoon from './components/ComingSoon.jsx';
import { setEmployee,clearEmployee } from './redux/slices/authSlice';
import {fetchCurrentEmployee, getAccounts,getClients,getEndClients,getJobStatuses,getSources,getRoleTypes,getEmployees, getAccountManagers, getHiringManagers} from './services/drop_downService.js';
import {setAccounts,setEndClients,setClients,setJobStatus,setSources,setRoleTypes,setEmployees,setHiringManagers,setAccountManagers} from './redux/slices/dropdownSlice';
import { useIsAuthenticated } from "@azure/msal-react";
import {
  useMsal
} from "@azure/msal-react";
import { loginRequest } from "./services/utilities/authConfig.js";

function App() {
  const dispatch = useDispatch();
const navigate = useNavigate(); 
const {inProgress, instance, accounts } = useMsal();
const [userDetails, setUserDetails] = useState(null);
 
const isAuthenticated = useIsAuthenticated();
  // Prevent dropdown fetch from running multiple times
  const dropdownsLoadedRef = useRef(false);
  // useEffect(() => {
  //   const account = accounts[0];
  //   if (account) {
  //     setUserDetails({ empName: account.username });
  //     instance.setActiveAccount(account);
  //     fetchDropdowns();
    
  //   } else {
  //     setUserDetails(null);
  //   }
  // }, [accounts]); 
  useEffect(() => {
    const init = async () => {
      // Wait for MSAL startup/redirect to complete
      if (inProgress !== "none") return;

      // If not authenticated, reset UI state
      if (!isAuthenticated) {
        setUserDetails(null);
        dropdownsLoadedRef.current = false;
        return;
      }

      // Pick account safely
      const account = instance.getActiveAccount() || accounts?.[0];
      if (!account) {
        setUserDetails(null);
        return;
      }

      // Ensure active account is set (important after refresh)
      instance.setActiveAccount(account);
      setUserDetails({ empName: account.username });

      // Ensure token exists before any API calls
      await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      // Fetch dropdowns only once
      // if (!dropdownsLoadedRef.current) {
      //   dropdownsLoadedRef.current = true;
      //   await fetchDropdowns();
      // }
    };

    init().catch((e) => console.error("MSAL init error:", e));
  }, [inProgress, isAuthenticated, accounts, instance]);

const handleLogin = async () => {
  try {
    
     // Step 1: interactive login
    const loginResponse = await instance.loginPopup(loginRequest);

    // Step 2: get the account
    const account =
      loginResponse.account ||
      instance.getActiveAccount() ||
      instance.getAllAccounts()[0];

    if (!account) {
      throw new Error("No MSAL account found after login");
    }

    // Step 3: remember the active account for the whole app
    instance.setActiveAccount(account);

    // Step 4: get access token for the API silently
    await instance.acquireTokenSilent({
      ...loginRequest,
      account,
    });




    // Step 3: Now API call will include Authorization header
    // Fetch employee details from Django
    const profile = await fetchCurrentEmployee();

    if (!profile.emp_details || !profile.is_active) {
    

      alert(`Hi ${profile.user}, you're Employee details not found`);


      handleLogout()
      return;
    }

    // Valid employee
    dispatch(setEmployee(profile));
    setUserDetails({ empName: profile.user });
    await fetchDropdowns();
    navigate("/allsubmissions");
  

  } catch (err) {

    console.error("Login / employee fetch error:", err);
     alert(`you're authenticated in Entra but not registered in the TA System.Please Contact admin.`);

      return;
  }
};
const handleLogout = async () => {
  try {
    await instance.logoutPopup();

    // After successful logout
    setUserDetails(null);
    persistor.purge();
    dispatch(clearEmployee());
    navigate("/");

  } catch (error) {
    console.error("Logout failed:", error);
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
   
 <Header userdetails={userDetails} onSignOut={handleLogout} onLogin={handleLogin} isAuthenticated={isAuthenticated}/>
<Routes>
  <Route path='/' element={<TAHomePage/>}/>
  <Route path='/addrequirements' element={<AuthCheck><RequirementForm/></AuthCheck>}/>
  <Route path='/submissions' element={<AuthCheck><Submission/></AuthCheck>}/>
   {/* <Route path='/allreqs' element={<AuthCheck><AllRequirements/></AuthCheck>}/> */}
    <Route path='/filledjob' element={<AuthCheck><OfferForm/></AuthCheck>}/>
    {/* <Route path='/allsubmissions' element={<AuthCheck><AllSubmissions/></AuthCheck>}/> */}
     <Route path='/submissionsDateEntry' element={<AuthCheck><SubmissionDatesForm/></AuthCheck>}/>
  <Route path='/submissionsDateDetails' element={<AuthCheck><AllSubmissionDates/></AuthCheck>}/>
   <Route path='/myprofile' element={<AuthCheck><MyProfile/></AuthCheck>}/>
   <Route path='/clientdashboard' element={<AuthCheck><ClientDashboard/></AuthCheck>}/>
   <Route path='/login' element={<Login onLogin={handleLogin}/>}/>
   <Route path="/allreqs/:empcode?" element={<AuthCheck><AllRequirements /></AuthCheck>} />
   <Route path="/allsubmissions/:empcode?" element={<AuthCheck><AllSubmissions /></AuthCheck>}
   
   />
   <Route path="/comingsoon/:feature" element={<AuthCheck><ComingSoon/></AuthCheck>}/>
</Routes>

 </>
  )
}

export default App
