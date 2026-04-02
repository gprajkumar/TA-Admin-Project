
import { Form, Row, Col } from "react-bootstrap";
import './ViewForm.css';
import { useSelector } from 'react-redux';
import React from 'react';

const MyProfile = () => {
  const emp_details = useSelector((state) => state.employee.employee_details);  // fixed access to state
  const emp_permissions = useSelector((state) => state.master_dropdown.permissions);  // Access permissions from dropdown slice
  const role_access = [];
  if (emp_details && emp_details.designation) {
    for (const [role, access] of Object.entries(emp_details.designation)) {
      if (access === true) {
        role_access.push(role); 
      }
    }
  }
 
console.log("Employee Permissions in MyProfile:", emp_permissions); // Debug log for permissions
  
  
  
  return (
    <>
    <div className='view-form-container '>
      <Row className="view-row">
        <Col md={6}>Employee Code:</Col>
        <Col md={6}>{emp_details?.emp_code || "N/A"}</Col>
       
      </Row>
  <Row className="view-row">
       
        <Col md={6}>Employee Name:</Col>
        <Col md={6}>{`${emp_details?.emp_fName || ""} ${emp_details?.emp_lName || ""}` || "N/A"}</Col>
      </Row>

      <Row className="view-row">
        <Col md={6}>Email ID:</Col>
        <Col md={6}>{emp_details?.email_id || "N/A"}</Col>
        
      </Row>
 <Row className="view-row">
     
        <Col md={6}>Designation:</Col>
        <Col md={6}>{emp_details?.designation?.designation_name || "N/A"}</Col>
      </Row>
    
    </div>
    {emp_permissions && (
    <div className='view-form-container '>
       <Row className="view-row">
      <p>Role Permissions for the Designation: {emp_details?.designation?.designation_name || "N/A"}</p>
      </Row>
     <Row className="view-row view-row-title">
     
        <Col md={6}>Module</Col>
        <Col md={6}>Permission</Col>
   
      </Row>
      <Row className="view-row">
        {emp_permissions && Object.keys(emp_permissions).length > 0 ? (
    Object.entries(emp_permissions).map(([moduleCode, permissions]) => (
      <React.Fragment key={moduleCode}>
        <Col md={6}>{moduleCode}</Col>
        <Col md={6}>{permissions.join(", ")}</Col>
      </React.Fragment>
    ))
        
        ) : (
          <Col md={6}>No access assigned</Col>
        )}
      </Row>
    </div>
    )}
    </>
  );
};

export default MyProfile;
