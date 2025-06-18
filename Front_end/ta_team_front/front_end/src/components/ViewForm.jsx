import { Form, Row, Col } from "react-bootstrap";
import './ViewForm.css';

const ViewForm = ({ data }) => {
    if (!data) {
    return <div className="view-form-container">No data available</div>;
  }
//   const entries = Object.entries(data);

//   // Group entries into chunks of two
//   const rowChunks = [];
//   for (let i = 0; i < entries.length; i += 2) {
//     rowChunks.push(entries.slice(i, i + 2));
//   }

//   return (
//     <div className="view-form-container">
//       {rowChunks.map((chunk, rowIndex) => (
//         <Row key={rowIndex} className="view-row">
//           {chunk.map(([key, value]) => (
//             <Col md={6} key={key}>
//               <div className="view-label-pair">
//                 <div className="view-col-label">{key}</div>
//                 <div className="view-col-value">{String(value)}</div>
//               </div>
//             </Col>
//           ))}
//         </Row>
//       ))}
//     </div>
//   );

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
        <Col md={3}>No of Positions:</Col>
        <Col md={3}>{data.no_of_positions || "N/A"}</Col>
        <Col md={3}>No of Positions Filled:</Col>
        <Col md={3}>{data.no_of_positions_filled || "N/A"}</Col>
      </Row>
       <Row className="view-row">
        <Col md={3}>Filled Date:</Col>
        <Col md={3}>{data.filled_date || "N/A"}</Col>
        <Col md={3}>Filled by Recruiter:</Col>
        <Col md={3}>{data.filled_by_recruiter_name || "N/A"}</Col>
      </Row>
     </div>
)
};


export default ViewForm;
