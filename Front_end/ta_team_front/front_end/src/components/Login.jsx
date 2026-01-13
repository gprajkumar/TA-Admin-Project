import React from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import "./Login.css";

const Login = ({ onLogin }) => {
  
  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <h2>Sign in</h2>
      <button className="btn btn-primary mt-3" onClick={onLogin}>
        Login with Azure AD
      </button>
    </div>
  );
};

export default Login;
