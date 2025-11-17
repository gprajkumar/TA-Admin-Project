import React, { useState, useEffect } from "react"
import { Navigate,useLocation } from "react-router-dom"
import Alert from 'react-bootstrap/Alert';
import { useIsAuthenticated } from "@azure/msal-react";
const AuthCheck = ({children}) =>
{
// const token = localStorage.getItem('accessToken')
// const [Show, setShow] = useState(false);
// const [redirect, setRedirect] = useState(false);
//   useEffect(() => {
//     if (!token) {
//       setShow(true); 
//     }
//   }, [token]);

//  const handleclose = () =>
//   {
//     setShow(false);
//     setRedirect(true);
    
//   }

// if (!token)
// {
//     if(redirect){ return <Navigate to="/login"/>} 
// return(

//           <Alert variant="danger" onClose={handleclose} dismissible>
//             <Alert.Heading>Login required</Alert.Heading>
//             <p>Please login to view this page.</p>
//           </Alert>
// )

       
// }

const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
return children;   

};

export default AuthCheck;