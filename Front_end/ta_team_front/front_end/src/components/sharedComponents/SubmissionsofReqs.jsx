import React, { useEffect, useState } from 'react';
import { getFilteredSubmissions } from '../../services/drop_downService';
import '../RequirementForm.css';
import '../AllRequirements.css';
import './SubmissionsofReqs.css';
import { formatDateMMDDYYYY } from '../../services/helper';
import { Row, Col } from 'react-bootstrap';

const SubmissionsofReqs = ({ requirmentid }) => {
  console.log('Fetching submissions for requirement ID:', requirmentid);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getFilteredSubmissions({ Job: requirmentid });
        setSubmissions(data.results || []);
        console.log('Fetched submissions data:', data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    if (requirmentid) {
      fetchSubmissions();
    }
  }, [requirmentid]);

  return submissions.length === 0 ? (
    <div className="title-row">
      No submissions found for this requirement.
    </div>
  ) : (
    <div>
      <Row className="title-row">
        <Col className="title-col">
          Job: {submissions[0]?.job_details?.job_code} -{' '}
          {submissions[0]?.job_details?.job_title}
        </Col>
      </Row>

      <Row className="header-row">
        <Col className="col-end-client">Submission Date</Col>
        <Col className="col-candidate">Candidate Name</Col>
        <Col className="col-recruiter">Client Submission Date</Col>
        <Col className="col-sourcer">Client Interview Date</Col>
        <Col className="col-job-type">Offer Date</Col>
        <Col className="col-job-status">Start Date</Col>
        <Col className="col-job-status" style={{ display: 'block' }}>
          Current Status
        </Col>
        <Col className="col-job-status">Loop Closed</Col>
      </Row>

      {submissions.map((sub) => (
        <Row key={sub.submission_id} className="data-row">
          <Col className="col-end-client">
            {sub.submission_date ? formatDateMMDDYYYY(sub.submission_date) : ''}
          </Col>

          <Col className="col-candidate">{sub.candidate_name}</Col>

          <Col className="col-recruiter">
            {sub.client_sub_date ? formatDateMMDDYYYY(sub.client_sub_date) : ''}
          </Col>

          <Col className="col-sourcer">
            {sub.client_interview_date
              ? formatDateMMDDYYYY(sub.client_interview_date)
              : ''}
          </Col>

          <Col className="col-job-type">
            {sub.offer_date ? formatDateMMDDYYYY(sub.offer_date) : ''}
          </Col>

          <Col className="col-job-status">
            {sub.start_date ? formatDateMMDDYYYY(sub.start_date) : ''}
          </Col>

          <Col className="col-job-status" style={{ display: 'block' }}>
            {sub.current_status}
          </Col>

          <Col className="col-job-status">
            <label
              style={{
                marginLeft: '5px',
                color: sub.loop_closed ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              {sub.loop_closed ? 'Yes' : 'No'}
            </label>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default SubmissionsofReqs;