import React from 'react';
import { Form, Row, Col } from "react-bootstrap";
import './ViewForm.css';
import { useSelector } from 'react-redux';

const MyProfile = () => {
  const emp_details = useSelector((state) => state.employee.employee_details);  // fixed access to state
  const role_access = [];

  if (emp_details && emp_details.designation) {
    for (const [role, access] of Object.entries(emp_details.designation)) {
      if (access === true) {
        role_access.push(role); 
      }
    }
  }

  return (
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
      <Row className="view-row">
        <Col md={6}>Access Details:</Col>
        {role_access.length > 0 ? (
          role_access.map((access, index) => (
            <Col md={6} key={index}>{access}</Col>
          ))
        ) : (
          <Col md={6}>No access assigned</Col>
        )}
      </Row>
    </div>
  );
};

export default MyProfile;
