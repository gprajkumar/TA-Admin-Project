import { useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import TechScreenForm from './forms/TechScreenForm';
import {
  getJobreqs,
  getSubmissionsbyReqid,
  getTechScreeners,
  getScreeningStatuses,
} from "../services/drop_downService";
import axiosInstance from "../services/axiosInstance";


const initialFormData = {
    job: "",
    candidate: "",
    tech_screener: "",
    screening_date: "",
    screening_status: "",
    feedback: ""
};

const REQUIRED_FIELDS = {
    job: "Job is required.",
    candidate: "Candidate is required.",
    tech_screener: "Tech screener is required.",
    screening_date: "Screening date is required.",
    screening_status: "Status is required.",
};

const TechScreenComponent = ({
    tech_screen_id,
    viewtype = false,
    externaldropdowndata,
    onSuccess,
}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [dropdownData, setDropdownData] = useState({
        jobs: [],
        candidates: [],
        techScreeners: externaldropdowndata?.techScreeners || [],
        screeningStatuses: externaldropdowndata?.screeningStatuses || [],
    });
    const [selectedJob, setSelectedJob] = useState(null);
    const [show, setShow] = useState(false);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [candidatesLoading, setCandidatesLoading] = useState(false);
    const isEditPrefillRef = useRef(!!tech_screen_id);
    const profileEmployee =  useSelector((state) => state.employee.employee_details);
   

    const updateField = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        updateField(e.target.name, e.target.value);
        if (e.target.name === "job") {
            const opt = e.target.selectedOption;
            setSelectedJob(opt || null);
        }
    };
    const handleSelect = ({ name, value }) => updateField(name, value);

    const loadJobOptions = async (inputValue) => {
        const res = await axiosInstance.get('/ta_team/requirement-search/', {
            params: { q: inputValue || "" },
        });
        return res.data.map((job) => ({
            value: job.requirement_id,
            label: `${job.job_code} - ${job.job_title}`,
        }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setSelectedJob(null);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = Object.fromEntries(
            Object.entries(REQUIRED_FIELDS).filter(([field]) => !formData[field])
        );
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const payload = {
            job: formData.job,
            submission: formData.candidate,
            tech_screener: formData.tech_screener,
            screening_status: formData.screening_status,
            screening_date: formData.screening_date,
            feedback: formData.feedback,
            updated_by: profileEmployee?.employee_id || null
        };

        try {
            if (tech_screen_id) {
                await axiosInstance.patch(`/ta_team/tech-screens/${tech_screen_id}/`, payload);
            } else {
                await axiosInstance.post('/ta_team/tech-screens/', payload);
                resetForm();
            }
            setShow(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Tech screen save failed:", err?.response?.data || err);
            alert("Save failed. Check console for details.");
        }
    };

    useEffect(() => {
        if (externaldropdowndata?.techScreeners?.length && externaldropdowndata?.screeningStatuses?.length) {
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                setJobsLoading(true);
                const [jobs, techScreeners, screeningStatuses] = await Promise.all([
                    getJobreqs(),
                    getTechScreeners(),
                    getScreeningStatuses(),
                ]);
                if (!cancelled) {
                    setDropdownData((prev) => ({
                        ...prev,
                        jobs,
                        techScreeners: techScreeners.map((t) => ({
                            id: t.tech_screener_id,
                            name: t.tech_screener_name,
                        })),
                        screeningStatuses: screeningStatuses.map((s) => ({
                            id: s.screening_status_id,
                            name: s.screening_status,
                        })),
                    }));
                }
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            } finally {
                if (!cancelled) setJobsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [externaldropdowndata]);

    useEffect(() => {
        if (!tech_screen_id) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await axiosInstance.get(`/ta_team/tech-screens/${tech_screen_id}/`);
                if (cancelled) return;
                const d = res.data;
                setFormData({
                    job: d.job || "",
                    candidate: d.submission || "",
                    tech_screener: d.tech_screener || "",
                    screening_status: d.screening_status || "",
                    screening_date: d.screening_date || "",
                    feedback: d.feedback || "",

                });
                if (d.job) {
                    setSelectedJob({
                        value: d.job,
                        label: `${d.job_code || ""} - ${d.job_title || ""}`,
                    });
                }
            } catch (err) {
                console.error("Error loading tech screen:", err);
            }
        })();
        return () => { cancelled = true; };
    }, [tech_screen_id]);

    useEffect(() => {
        if (!formData.job) {
            setDropdownData((prev) => ({ ...prev, candidates: [] }));
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                setCandidatesLoading(true);
                setDropdownData((prev) => ({ ...prev, candidates: [] }));
                if (!isEditPrefillRef.current) {
                    setFormData((prev) => ({ ...prev, candidate: "" }));
                }
                const candidates = await getSubmissionsbyReqid(formData.job);
                if (!cancelled) {
                    setDropdownData((prev) => ({
                        ...prev,
                        candidates: candidates.map((c) => ({
                            id: c.submission_id,
                            name: c.candidate_name,
                        })),
                    }));
                    isEditPrefillRef.current = false;
                }
            } catch (error) {
                console.error("Error fetching candidates:", error);
            } finally {
                if (!cancelled) setCandidatesLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [formData.job]);

    return (
        <div>
            <TechScreenForm
                formData={formData}
                errors={errors}
                dropdownData={dropdownData}
                loadJobOptions={loadJobOptions}
                selectedJob={selectedJob}
                viewtype={viewtype}
                isEditMode={!!tech_screen_id}
                show={show}
                setShow={setShow}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                OnhandleSelect={handleSelect}
                resetform={resetForm}
                loading={jobsLoading || candidatesLoading}
                jobsLoading={jobsLoading}
                candidatesLoading={candidatesLoading}
            />
        </div>
    )
}
export default TechScreenComponent;
