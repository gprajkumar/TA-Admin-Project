import React from "react"
import { Navigate,useLocation } from "react-router-dom"
import Alert from 'react-bootstrap/Alert';
import { useMsal,useIsAuthenticated } from "@azure/msal-react";
const AuthCheck = ({children}) =>
{
const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
const { inProgress } = useMsal();
 

  // IMPORTANT: wait for MSAL to restore account from cache
  if (inProgress !== "none") return null; // or loader

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
return children;   

};

export default AuthCheck;