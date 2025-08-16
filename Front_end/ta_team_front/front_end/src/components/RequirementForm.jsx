import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../services/axiosInstance";
import "./RequirementForm.css"; // External CSS
import { normalizeData } from "../services/utilities/utilities";
import useMasterDropdowns from "../services/customHooks/useMasterDropdowns";
import Loader from "./sharedComponents/Loader";
import RequirementComponent from "./RequirementComponent";
const RequirementForm = ({ reqid, viewtype = false, externaldropdowndata }) => {

  const initialFormData = {
    job_title: "",
    job_code: "",
    client: "",
    end_client: "",
    account: "",
    job_status: "",
    assigned_recruiter: "",
    assigned_sourcer: "",
    accountManager: "",
    hiringManager: "",
    role_type: "",
    notes: "",
    req_opened_date: "",
    no_of_positions: "1",
  };
  const [loading, setLoading] = useState(reqid ? true : false);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
 

  const {
    drop_down_endClients,
    drop_down_clients,
    drop_down_jobStatus,
    drop_down_accountManagers,
    drop_down_hiringManagers,
    drop_down_roleTypes,
    drop_down_employees,
    drop_down_accounts
  } = useMasterDropdowns();

  const [formData, setFormData] = useState(initialFormData);

  const [dropdownData, setDropdownData] = useState({
    clients: [],
    endClients: [],
    accounts: [],
    jobStatuses: [],
    recruiters: [],
    sourcers: [],
    accountManagers: [],
    hiringManagers: [],
    roletypes: [],
  });
  const OnhandleSelect = useCallback(
    ({ name, value }) => {
      setFormData((prevdata) => ({ ...prevdata, [name]: value }));
    },
    [setFormData]
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((preverrors) => ({ ...preverrors, [name]: "" }));
    }
  };
  const resetform = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setFormData(initialFormData);
      setErrors({});
    }
  };
  useEffect(() => {
    if (externaldropdowndata) {
      setDropdownData({
        clients: externaldropdowndata.clients,
        endClients: externaldropdowndata.endClients,
        accounts: normalizeData(
          drop_down_accounts,
          "account_id",
          "account_name"
        ),
        jobStatuses: externaldropdowndata.jobstatuses,
        recruiters: externaldropdowndata.recruiters,
        sourcers: externaldropdowndata.sourcers,
        accountManagers: normalizeData(
          drop_down_accountManagers,
          "account_manager_id",
          "account_manager"
        ),
        hiringManagers: normalizeData(
          drop_down_hiringManagers,
          "hiring_manager_id",
          "hiring_manager"
        ),
        roletypes: externaldropdowndata.roletypes,
      });
    } else {
      const [
        clientsRes,
        endClientsRes,
        accountsRes,
        jobStatusesRes,
        recruitersRes,
        sourcersRes,
        accountManagersRes,
        hiringManagersRes,
        roletypeRes,
      ] = [
        drop_down_clients,
        drop_down_endClients,
        drop_down_accounts,
        drop_down_jobStatus,
        drop_down_employees.filter(
          (employees) =>
            employees.can_recruit === true && employees.department === 2
        ),
        drop_down_employees.filter(
          (employees) =>
            employees.can_source === true && employees.department === 1
        ),
        drop_down_accountManagers,
        drop_down_hiringManagers,
        drop_down_roleTypes,
      ];

      setDropdownData({
        clients: normalizeData(clientsRes, "client_id", "client_name"),
        endClients: normalizeData(
          endClientsRes,
          "end_client_id",
          "end_client_name"
        ),
        accounts: normalizeData(accountsRes, "account_id", "account_name"),
        jobStatuses: normalizeData(
          jobStatusesRes,
          "job_status_id",
          "job_status"
        ),
        recruiters: normalizeData(recruitersRes, "employee_id", "emp_fName"),
        sourcers: normalizeData(sourcersRes, "employee_id", "emp_fName"),
        accountManagers: normalizeData(
          accountManagersRes,
          "account_manager_id",
          "account_manager"
        ),
        hiringManagers: normalizeData(
          hiringManagersRes,
          "hiring_manager_id",
          "hiring_manager"
        ),
        roletypes: normalizeData(roletypeRes, "role_type_id", "role_type"),
      });
    }
  }, [externaldropdowndata]);

  useEffect(() => {
    if (!reqid) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        if (reqid) {
          const res = await axiosInstance.get(
            `/ta_team/requirements/${reqid}/`
          );
          setFormData(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchData();
  }, [reqid]);



  const validateForm = () => {
    const newErrors = {};
    if (!formData.job_code.trim()) newErrors.job_code = "Job code is required";
    if (!formData.job_title.trim())
      newErrors.job_title = "Job title is required";
    if (!formData.req_opened_date) {
      newErrors.req_opened_date = "Date is required";
    }

    if (!formData.no_of_positions)
      newErrors.no_of_positions = "Number of positions is required";
    if (!formData.account) newErrors.account = "Account is required";
    if (!formData.client) newErrors.client = "Client is required";
    if (!formData.end_client) newErrors.end_client = "End client is required";
    if (!formData.hiringManager)
      newErrors.hiringManager = "Hiring manager is required";
    if (!formData.assigned_recruiter)
      newErrors.assigned_recruiter = "Assigned recruiter is required";
    if (!formData.assigned_sourcer)
      newErrors.assigned_sourcer = "Assigned sourcer is required";
    if (!formData.role_type) newErrors.role_type = "Job type is required";
    if (!formData.job_status) newErrors.job_status = "Job status is required";
    if (!formData.accountManager)
      newErrors.accountManager = "Account manager is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (!reqid) {
        await axiosInstance.post(`/ta_team/requirements/`, formData);
        setShow(true);
        resetform();
      } else {
        await axiosInstance.patch(`/ta_team/requirements/${reqid}/`, formData);
        setShow(true);
        resetform();
      }
    } catch (err) {
      console.error("Error submitting requirement:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
      alert("Submission failed");
    }
  };

  if (loading) {
    return  <Loader />;
  } else {
    return (
       <RequirementComponent
    viewtype={viewtype}
    reqid={reqid}
    formData={formData}
    dropdownData={dropdownData}
    errors={errors}
    show={show}
    setShow={setShow}
    handleSubmit={handleSubmit}
    handleChange={handleChange}
    OnhandleSelect={OnhandleSelect}
    resetform={resetform}
  />

    );
  }
};

export default RequirementForm;
