import React, { useEffect,useState } from 'react';
import { Form, Row, Col } from "react-bootstrap";
import './ViewForm.css';
import { useSelector } from 'react-redux';
import axiosInstance from '../services/axiosInstance';
import { findDimensionValueType } from 'framer-motion';

const MyProfile = () => {
  const emp_details = useSelector((state) => state.employee.employee_details);  // fixed access to state
  const role_access = [];
  const [loadPermissions , setLoadPermissions] = useState(false);
  if (emp_details && emp_details.designation) {
    for (const [role, access] of Object.entries(emp_details.designation)) {
      if (access === true) {
        role_access.push(role); 
      }
    }
  }
  const [role_permission, setRolePermission] = useState([]);

  useEffect(() => {
     if (emp_details?.designation?.designation_id) {
  fetchPermissionData();
     }
  }, [emp_details?.designation?.designation_id]);

  const fetchPermissionData = async () => {
    try {
      const response = await axiosInstance.get(`/ta_team/role-permissions/`, {
        params: { id: emp_details?.designation?.designation_id || "" }
      });
      const permissions = response.data;
      console.log("Role Permissions:", permissions);
      setRolePermission(permissions);
    }
    catch (error) {
      console.error("Error fetching role permissions:", error); 
    }
    finally {
setLoadPermissions(true);
    }
  }
  
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
    {loadPermissions && (
    <div className='view-form-container '>
       <Row className="view-row">
      <p>Role Permissions for the Designation: {emp_details?.designation?.designation_name || "N/A"}</p>
      </Row>
     <Row className="view-row view-row-title">
     
        <Col md={6}>Module</Col>
        <Col md={6}>Permission</Col>
   
      </Row>
      <Row className="view-row">
        {role_permission.length > 0 ? (
          role_permission.map((permission, index) => (
            <React.Fragment key={index}>
              <Col md={6}>{permission.module_name}</Col>
              <Col md={6}>{permission.permission_type_name}</Col>
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
