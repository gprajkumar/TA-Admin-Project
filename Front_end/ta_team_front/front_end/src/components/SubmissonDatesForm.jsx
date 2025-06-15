import { useEffect, useState } from "react";
import {getJobreqs,getSubmissionsbyReqid}
from "../services/drop_downService";
import { Form, Row, Col, Button, FormGroup, FormLabel } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
const SubmissionDatesForm = () =>
{
  const baseurl = import.meta.env.VITE_API_BASE_URL;
    const [FormData, setFormData] = useState({
        client_sub_date: "",
        client_interview_date:"",
        offer_date:"",
        start_date:"",
        submission_id:"",
        requirement_id:"",
        tech_screen_date:""
    })
    const [JobData, setJobData] = useState([])
    const[CandidateData,setCandidateData] = useState([])
    const[DropdownData,setDropdownData] = useState(
        {
            jobdropdown:[],
            candidatedropdown:[]
        }
    )
    useEffect(() => {
  const fetchJobData = async () => {
    const jobData = await getJobreqs();
    setJobData(jobData);
    setDropdownData((prev) => ({
      ...prev,
      jobdropdown: jobData.map((job) => ({id: job.requirement_id, name: `${job.job_code} - ${job.job_title}`}))
    }));
  };

  

  fetchJobData();

 
},[]);
const resetform = () => {
    setFormData({
      client_sub_date: "",
        client_interview_date:"",
        offer_date:"",
        start_date:"",
        submission_id:"",
        requirement_id:"",
        tech_screen_date:""
    });
  };

const fetchCandidateData = async () => {
    const candidateData = await getSubmissionsbyReqid(FormData.requirement_id);
    setCandidateData(candidateData);
    setDropdownData((prev) => ({
      ...prev,
      candidatedropdown: candidateData.map((candidate)=>({id:candidate.submission_id,name:candidate.candidate_name}))
    }));
  };

    useEffect(() => {
    fetchCandidateData();
    }, [FormData.requirement_id])

  const handleSubmit = async (e) => {
   e.preventDefault();

    try {
      
      await axios.patch(`${baseurl}/ta_team/submissions/${FormData.submission_id}/`, FormData);
     
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
 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
   
  };


   const renderSelect = (name, label, options) => {
    const selectOptions = (options || []).map((opt) => ({
      value: opt.id,
      label: opt.name,
    }));

    // Find the selected option in react-select's format
    const selectedOption = selectOptions.find(
      (opt) => opt.value === FormData[name]
    );

    return (
      <div className="mb-3">
        <Select
          classNamePrefix="my-select"
          options={selectOptions}
          value={selectedOption || null}   
          onChange={(selected) => {
            handleChange({
              target: { name, value: selected ? selected.value : "" },
            });
          }}
          placeholder={`Select ${label}`}
          isClearable
        />
      </div>
    );
  };
    
    return (<div>
        <Form onSubmit={handleSubmit} className="requirement-form container">
            <Row>
                <Col md={6}>
                        <Form.Group className="mb-3 " controlId="job">
                          <Form.Label className="fs-6">Job:</Form.Label>
                          {renderSelect("requirement_id", "Job", DropdownData.jobdropdown)}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3 " controlId="job">
                          <Form.Label className="fs-6">Candidate:</Form.Label>
                          {renderSelect("submission_id", "Candidate", DropdownData.candidatedropdown)}
                        </Form.Group>
                      </Col>
            </Row>
 <Row>
       
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="tech_screen_date">
            <Form.Label className="fs-6">:</Form.Label>
             <Form.Control
              type="date"
              placeholder="Tech Screen Date"
              name="tech_screen_date"  
              value={FormData.tech_screen_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
         <Col md={6}>
          <Form.Group className="mb-3 " controlId="client_sub_date">
            <Form.Label className="fs-6">Date Req Opened:</Form.Label>
             <Form.Control
              type="date"
              placeholder="Client Submission Date"
              name="client_sub_date"  
              value={FormData.client_sub_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        </Row>
         <Row>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="client_interview_date">
            <Form.Label className="fs-6">Client Interview Date:</Form.Label>
             <Form.Control
              type="date"
              placeholder="Client Interview Date:"
              name="client_interview_date"  
              value={FormData.client_interview_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3 " controlId="offer_date">
            <Form.Label className="fs-6">Offer Date:</Form.Label>
             <Form.Control
              type="date"
              placeholder="Enter Job Open Date"
              name="offer_date"  
              value={FormData.offer_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        </Row>
        <Row>
             <Col md={6}>
          <Form.Group className="mb-3 " controlId="start_date">
            <Form.Label className="fs-6">Start Date:</Form.Label>
             <Form.Control
              type="date"
              placeholder="Enter Job Open Date"
              name="start_date"  
              value={FormData.start_date}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        </Row>
         <Button className="submit-button" type="submit">
              Submit</Button>
              <Button className="submit-button" type="button" onClick={resetform}>
                Reset
              </Button>
        </Form>
     
    </div>
   )
}

export default SubmissionDatesForm;