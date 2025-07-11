import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash,FaSearch } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import "./RequirementForm.css"; // External CSS
import "./AllRequirements.css";

import {
 
  getJobreqs,
  
  getSubmissionsbyReqid,
} from "../services/drop_downService";
import { Form, Row, Col, Button, Container, FormControl } from "react-bootstrap";
import Select from "react-select";


const OfferForm = () => {

   const baseurl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setformData] = useState({
       requirement_id : '',
       job_status:'2',
       updated_at: new Date().toISOString().split('T')[0],
       no_of_positions_filled:'1',
       filled_date: ''

    })
    const [errors,setError] = useState({});

    const validateForm = () =>
    {
      const newErrors ={};
      if(!formData.requirement_id) newErrors.requirement_id = "Please Select Job";
      if(!formData.no_of_positions_filled || formData.no_of_positions_filled < 1 ) newErrors.no_of_positions_filled = "Please Enter No of roles filled";
      if(submissions.filter(Boolean).length !== count ) newErrors.subcount = "Please Select Candidates";
      console.log(`${submissions.length} && ${count}`)
      if(!formData.filled_date) newErrors.filled_date = "Please Enter Filled Date"
      setError(newErrors)
      return Object.keys(newErrors) === 0;
    }
    const resetform = () => {
    setformData({
      requirement_id : '',
       job_status:'',
       updated_at:'',
       no_of_positions_filled:'',
       filled_date: ''
    });
  setCount(1);           // reset filled positions count
  setSubmissions([""]);  // reset submissions array
  setcandidateDropdown([]);  // clear candidate dropdown options
  };
     const handleChange = (selected, name, idx) => {
     const value = selected ? selected.value : "";

  if (idx === 100) {
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  } else {
    setSubmissions((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
    
  }
  };
const renderSelect = (name, label, options, idx = 100) => {
  const selectOptions = (options || []).map((opt) => ({
    value: opt.id,
    label: opt.name,
  }));

  const selectedOption = idx === 100
    ? selectOptions.find((opt) => opt.value === formData[name])
    : selectOptions.find((opt) => opt.value === submissions[idx]);

  const hasError = idx === 100 ? !!errors[name] : !!errors.subcount;

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fs-6">
        {label} <span style={{ color: "red" }}>*</span>:
      </Form.Label>
      <Select
        classNamePrefix="my-select"
        options={selectOptions}
        value={selectedOption || null}
        onChange={(selected) => handleChange(selected, name, idx)}
        placeholder={`Select ${label}`}
        isClearable
        styles={{
          control: (base) => ({
            ...base,
            borderColor: hasError ? "#dc3545" : base.borderColor,
            boxShadow: hasError
              ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
              : base.boxShadow,
            '&:hover': {
              borderColor: hasError ? "#dc3545" : base.borderColor,
            },
          }),
        }}
      />
      {hasError && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {idx === 100 ? errors[name] : errors.subcount}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
 const [count, setCount] = useState(1);
 const [jobDropdown, setjobDropdown] = useState([]);
 const [candidateDropdown, setcandidateDropdown] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const jobs = await getJobreqs();
      setjobDropdown(
        jobs.map((job) => ({
          id: job.requirement_id,
          name: `${job.job_code} - ${job.job_title}`,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch job requirements:', error);
    }
  };

  fetchData();
}, []);

useEffect(()=>{
  const fetchCandidates = async () =>
  {
    const candidates = await getSubmissionsbyReqid(formData.requirement_id);
    console.log(formData.requirement_id)
    setcandidateDropdown(
      candidates.map((item) => ({ id:item.submission_id,name:item.candidate_name}))
    );
  setSubmissions(Array.from({ length: count }, () => ""));
  }
  fetchCandidates();
},[formData.requirement_id])
    const [submissions, setSubmissions] = useState([""]);

    const handlecountChange = (e) =>
    {
        const newCount = parseInt(e.target.value);
        setCount(newCount);
        setformData((prev)=>({...prev,no_of_positions_filled : newCount }))
        setSubmissions(Array(newCount).fill(""));
    };
const handleSubmit = async (e) => {
   e.preventDefault();
  if(!validateForm())
  {
  if (errors.subcount) alert(errors.subcount);
    return
  }
    try {
      
      await axios.patch(`${baseurl}/ta_team/requirements/${formData.requirement_id}/`, formData);
      console.log(formData)
      console.log(submissions)
       for (const subdata of submissions) {
      const placment_data = { submission: subdata, Job: formData.requirement_id };
      await axios.post(`${baseurl}/ta_team/placements/`, placment_data);
    }
   alert("Submission Success");
       // setShow(true);
      resetform();
      }
     catch (err) {
      console.error("Error submitting requirement:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
      alert("Submission failed");
    }

}
    return(
        <Form onSubmit={handleSubmit} className="requirement-form container">
      <h2 className="mb-4">Offer Details</h2>

      <Row>
         <Col md={6}>
        
            {renderSelect("requirement_id", "Job", jobDropdown,100)}
          
        </Col>
           <Col md={6}>
                   <Form.Group className="mb-3 " controlId="filled_date">
                     <Form.Label className="fs-6">Filled Date:</Form.Label>
                     <Form.Control
                       type="Date"
                       name="filled_date"
                       value={formData.filled_date}
                         isInvalid={!!errors.filled_date}
                       onChange={(e) =>
        setformData((prev) => ({
          ...prev,
          filled_date: e.target.value,
        }))}
                     />
                     <Form.Control.Feedback type="invalid">
                    {errors.filled_date}
                   </Form.Control.Feedback>
                   </Form.Group>
                   
                 </Col>
        </Row>
        <Row>
            <Col md={6}>
          <Form.Group className="mb-3 " controlId="no_of_positions_filled">
            <Form.Label className="fs-6">Filled Positions:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Enter Filled Positions"
              isInvalid={!!errors.no_of_positions_filled}
              name="no_of_positions_filled"   
              value={formData.no_of_positions_filled}
              onChange={handlecountChange}
            />
               <Form.Control.Feedback type="invalid">
                    {errors.no_of_positions_filled}
                   </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
        {submissions.map((val,idx) => (
        <div key={idx}>
         
            {renderSelect("candidate_name", "Candidate Name", candidateDropdown,idx)}
        
          </div>
       
        ))}
         </Col> 
      </Row>
   <Row className="justify-content-center mt-4">
  <Col xs="auto">
    <Button className="submit-button" type="submit">
      Submit Offer
    </Button>
  </Col>
  <Col xs="auto">
    <Button className="submit-button" type="button" onClick={resetform}>
      Reset
    </Button>
  </Col>
</Row>

    </Form>
    );


}

export default OfferForm;