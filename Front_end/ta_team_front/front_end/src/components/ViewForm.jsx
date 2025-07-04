import { Form, Row, Col } from "react-bootstrap";
import './ViewForm.css';

const ViewForm = ({ data, formtype = "Requirment"}) => {
    if (!data) {
    return <div className="view-form-container">No data available</div>;
  }

if(formtype === "Requirment")
{
return (
      <div className="view-form-container">
      <Row className="view-row">
        <Col md={3}>Job Code:</Col>
        <Col md={3}>{data.job_code || "N/A"}</Col>
        <Col md={3}>Job Title:</Col>
        <Col md={3}>{data.job_title || "N/A"}</Col>
      </Row>

      <Row className="view-row">
        <Col md={3}>Opened Date:</Col>
        <Col md={3}>{data.req_opened_date || "N/A"}</Col>
        <Col md={3}>Client Name:</Col>
        <Col md={3}>{data.client_name || "N/A"}</Col>
      </Row>

      <Row className="view-row">
        <Col md={3}>End Client:</Col>
        <Col md={3}>{data.end_client_name || "N/A"}</Col>
        <Col md={3}>Status:</Col>
        <Col md={3}>{data.job_status_name || "N/A"}</Col>
      </Row>
 <Row className="view-row">
        <Col md={3}>Account:</Col>
        <Col md={3}>{data.account_name || "N/A"}</Col>
        <Col md={3}>Account Manager:</Col>
        <Col md={3}>{data.account_manager_name || "N/A"}</Col>
      </Row>
       <Row className="view-row">
        <Col md={3}>Assigned Recruiter:</Col>
        <Col md={3}>{data.assigned_recruiter_name || "N/A"}</Col>
        <Col md={3}>Assigned Sourcer:</Col>
        <Col md={3}>{data.assigned_sourcer_name || "N/A"}</Col>
      </Row>
      <Row className="view-row">
        <Col md={3}>Hiring Manager:</Col>
        <Col md={3}>{data.hiring_manager_name || "N/A"}</Col>
        <Col md={3}>Role Type:</Col>
        <Col md={3}>{data.role_type_name || "N/A"}</Col>
      </Row>
     
       <Row className="view-row">
        <Col md={3}>No of Positions:</Col>
        <Col md={3}>{data.no_of_positions || "N/A"}</Col>
        <Col md={3}>No of Positions Filled:</Col>
        <Col md={3}>{data.no_of_positions_filled || "N/A"}</Col>
      </Row>
       <Row className="view-row">
        <Col md={3}>Filled Date:</Col>
        <Col md={3}>{data.filled_date || "N/A"}</Col>
      </Row>
     </div>
)
}
else
{
return (
      <div className="view-form-container">
      <Row className="view-row">
        <Col md={3}>Job Code:</Col>
        <Col md={3}>{data.job_details.job_code || "N/A"}</Col>
        <Col md={3}>Job Title:</Col>
        <Col md={3}>{data.job_details.job_title || "N/A"}</Col>
      </Row>

      <Row className="view-row">
        <Col md={3}>Submission Date:</Col>
        <Col md={3}>{data.submission_date || "N/A"}</Col>
        <Col md={3}>Candidate Name:</Col>
        <Col md={3}>{data.candidate_name || "N/A"}</Col>
      </Row>

      <Row className="view-row">
        <Col md={3}>Payrate:</Col>
        <Col md={3}>{data.payrate || "N/A"}</Col>
        <Col md={3}>Tax Term:</Col>
        <Col md={3}>{data.w2_C2C || "N/A"}</Col>
      </Row>
       <Row className="view-row">
        <Col md={3}>Submitted by Recruiter:</Col>
        <Col md={3}>{data.recruiter_name || "N/A"}</Col>
        <Col md={3}>Submitted by Sourcer:</Col>
        <Col md={3}>{data.sourcer_name || "N/A"}</Col>
        <Col md={3}>Candidate Source:</Col>
        <Col md={3}>{data.source_name || "N/A"}</Col>
      </Row>
 <Row className="view-row">
        <Col md={3}>AM Submission Date:</Col>
        <Col md={3}>{data.submission_date || "N/A"}</Col>
        <Col md={3}>Am Screen Date:</Col>
        <Col md={3}>{data.am_screen_date || "N/A"}</Col>
      </Row>
       <Row className="view-row">
        <Col md={3}>Tech Screen Date:</Col>
        <Col md={3}>{data.tech_screen_date || "N/A"}</Col>
        <Col md={3}>Client Submission Date:</Col>
        <Col md={3}>{data.client_sub_date || "N/A"}</Col>
      </Row>
      <Row className="view-row">
        <Col md={3}>Client Interview Date:</Col>
        <Col md={3}>{data.client_interview_date || "N/A"}</Col>
        <Col md={3}>Offer Date:</Col>
        <Col md={3}>{data.offer_date || "N/A"}</Col>
      </Row>
     
       <Row className="view-row">
        <Col md={3}>Start Date:</Col>
        <Col md={3}>{data.start_date || "N/A"}</Col>
        <Col md={3}>Current Status:</Col>
        <Col md={3}>{data.current_status || "N/A"}</Col>
      </Row>
      
     </div>
)
}
};


export default ViewForm;
