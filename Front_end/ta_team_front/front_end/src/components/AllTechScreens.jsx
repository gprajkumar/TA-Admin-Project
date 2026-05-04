import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Pagination from "react-bootstrap/Pagination";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import "./RequirementForm.css";
import "./AllRequirements.css";
import { formatDateMMDDYYYY } from "../services/helper";
import MultiSelect from "./sharedComponents/MultiSelect";
import useDebounce from "../services/customHooks/useDebounce";
import {
    getFilteredTechScreens,
    getTechScreeners,
    getScreeningStatuses,
} from "../services/drop_downService";
import axiosInstance from "../services/axiosInstance";
import TechScreenComponent from "./TechScreenComponent";

const PAGE_SIZE = 25;

const initialSelected = {
    job: "",
    candidate_name: "",
    tech_screener: [],
    screening_status: [],
    from_date: "",
    to_date: "",
    empcode: "",
};

const AllTechScreens = () => {
    const { empcode } = useParams();
    const baseurl = import.meta.env.VITE_API_BASE_URL;

    const [selectedvalue, setSelectedvalue] = useState(initialSelected);
    const [candidateName, setCandidateName] = useState("");
    const debouncedCandidateName = useDebounce(candidateName, 500);

    const [filterDropdownData, setFilterDropdownData] = useState({
        techScreeners: [],
        screeningStatuses: [],
    });
    const [filteredScreens, setFilteredScreens] = useState([]);
    const [paginationData, setPaginationData] = useState({
        totalpages: 0,
        currentpage: 1,
        totalrecords: 0,
        startpageitemno: 2,
        endpageitemno: 0,
    });

    const [show, setShow] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const [viewtype, setViewtype] = useState(false);

    useEffect(() => {
        setSelectedvalue((prev) => ({ ...prev, candidate_name: debouncedCandidateName }));
    }, [debouncedCandidateName]);

    useEffect(() => {
        setSelectedvalue((prev) => ({ ...prev, empcode: empcode || "" }));
    }, [empcode]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [screeners, statuses] = await Promise.all([
                    getTechScreeners(),
                    getScreeningStatuses(),
                ]);
                if (cancelled) return;
                setFilterDropdownData({
                    techScreeners: screeners.map((t) => ({
                        id: t.tech_screener_id,
                        name: t.tech_screener_name,
                    })),
                    screeningStatuses: statuses.map((s) => ({
                        id: s.screening_status_id,
                        name: s.screening_status,
                    })),
                });
            } catch (err) {
                console.error("Error fetching filter dropdowns:", err);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const buildFilters = (page) => {
        const filters = {};
        Object.entries(selectedvalue).forEach(([k, v]) => {
            if (Array.isArray(v)) {
                if (v.length) filters[k] = v;
            } else if (v !== "") {
                filters[k] = v;
            }
        });
        filters.page = page;
        return filters;
    };

    const handleSearch = async (page = 1) => {
        try {
            const data = await getFilteredTechScreens(buildFilters(page));
            const totalPages = Math.ceil((data.count || 0) / PAGE_SIZE);
            setPaginationData((prev) => ({
                ...prev,
                totalpages: totalPages,
                currentpage: page,
                totalrecords: data.count || 0,
                startpageitemno: 2,
                endpageitemno: totalPages > 10 ? 6 : totalPages - 1,
            }));
            setFilteredScreens(data.results || []);
        } catch (err) {
            console.error("Error fetching tech screens:", err);
        }
    };

    useEffect(() => {
        handleSearch(1);
    }, [selectedvalue]);

    const handlePageChange = async (page) => {
        try {
            const data = await getFilteredTechScreens(buildFilters(page));
            const totalPages = paginationData.totalpages;
            let newStart = paginationData.startpageitemno;
            let newEnd = paginationData.endpageitemno;
            if (totalPages > 10) {
                if (page <= 3) { newStart = 2; newEnd = 6; }
                else if (page >= totalPages - 2) { newStart = totalPages - 5; newEnd = totalPages - 1; }
                else { newStart = page - 2; newEnd = page + 2; }
            } else {
                newStart = 2; newEnd = totalPages - 1;
            }
            setPaginationData((prev) => ({
                ...prev,
                currentpage: page,
                startpageitemno: newStart,
                endpageitemno: newEnd,
            }));
            setFilteredScreens(data.results || []);
        } catch (err) {
            console.error("Error fetching page:", err);
        }
    };

    const refreshCurrentPage = async () => {
        await handlePageChange(paginationData.currentpage || 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedvalue((prev) => ({ ...prev, [name]: value }));
    };

    const loadJobOptions = async (inputValue) => {
        const res = await axiosInstance.get(`${baseurl}/ta_team/requirement-search/`, {
            params: { q: inputValue || "" },
        });
        return res.data.map((job) => ({
            value: job.requirement_id,
            label: `${job.job_code} - ${job.job_title}`,
        }));
    };

    const handleClose = () => setShow(false);

    const handleView = (id) => {
        setCurrentId(id);
        setViewtype(true);
        setShow(true);
    };

    const handleEdit = (id) => {
        setCurrentId(id);
        setViewtype(false);
        setShow(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this technical screening record?")) return;
        try {
            await axiosInstance.delete(`/ta_team/tech-screens/${id}/`);
            refreshCurrentPage();
        } catch (err) {
            console.error("Failed to delete tech screen:", err);
        }
    };

    const paginatedItemGenerate = () => {
        const items = [];
        const { totalpages, startpageitemno, endpageitemno, currentpage } = paginationData;
        if (totalpages <= 10) {
            for (let i = 2; i <= totalpages; i++) {
                items.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentpage}
                        onClick={() => handlePageChange(i)}
                    >{i}</Pagination.Item>
                );
            }
        } else {
            if (startpageitemno > 2) items.push(<Pagination.Ellipsis key="startellipsis" />);
            for (let i = startpageitemno; i <= endpageitemno; i++) {
                if (i !== 1 && i !== totalpages) {
                    items.push(
                        <Pagination.Item
                            key={i}
                            active={i === currentpage}
                            onClick={() => handlePageChange(i)}
                        >{i}</Pagination.Item>
                    );
                }
            }
            if (endpageitemno < totalpages - 1) items.push(<Pagination.Ellipsis key="ellipsis" />);
            if (endpageitemno < totalpages) {
                items.push(
                    <Pagination.Item
                        key={totalpages}
                        active={totalpages === currentpage}
                        onClick={() => handlePageChange(totalpages)}
                    >{totalpages}</Pagination.Item>
                );
            }
        }
        return items;
    };

    return (
        <div className="data-container">
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="job">
                        <Form.Label className="fs-6">Job:</Form.Label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={loadJobOptions}
                            onChange={(opt) =>
                                setSelectedvalue((prev) => ({ ...prev, job: opt ? opt.value : "" }))
                            }
                            isClearable
                            placeholder="Search job by title or code"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3" controlId="candidate_name">
                        <Form.Label className="fs-6">Candidate Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="candidate_name"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            placeholder="Search by candidate name"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <MultiSelect
                        name="tech_screener"
                        label="Technical Screener"
                        options={filterDropdownData.techScreeners}
                        value={selectedvalue.tech_screener}
                        onChange={handleChange}
                        placeholder="Select Screener(s)"
                    />
                </Col>
                <Col md={6}>
                    <MultiSelect
                        name="screening_status"
                        label="Screening Status"
                        options={filterDropdownData.screeningStatuses}
                        value={selectedvalue.screening_status}
                        onChange={handleChange}
                        placeholder="Select Status(es)"
                    />
                </Col>
            </Row>

            <Row className="align-items-end mb-3">
                <Col md={2}>
                    <Form.Group controlId="from_date">
                        <Form.Label className="fs-6">From:</Form.Label>
                        <Form.Control
                            type="date"
                            className="date-filter-input"
                            name="from_date"
                            value={selectedvalue.from_date}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="to_date">
                        <Form.Label className="fs-6">To:</Form.Label>
                        <Form.Control
                            type="date"
                            className="date-filter-input"
                            name="to_date"
                            value={selectedvalue.to_date}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-center">
                    <button
                        className="search-button"
                        aria-label="Search"
                        title="Search"
                        onClick={() => handleSearch(1)}
                    >
                        <FaSearch />
                    </button>
                </Col>
                <Col md={3} className="d-flex align-items-center">
                    <div className="jobs-found">
                        <span className="jobs-found-label">Tech Screens Found:</span>
                        <span className="jobs-found-count ms-2">{paginationData.totalrecords}</span>
                    </div>
                </Col>
            </Row>

            <Row className="header-row">
                <Col className="col-job-title">Job</Col>
                <Col className="col-client">Candidate</Col>
                <Col className="col-recruiter">Screener</Col>
                <Col className="col-end-client">Screening Date</Col>
                <Col className="col-job-status">Status</Col>
                {/* <Col className="col-job-status">Feedback</Col> */}
                <Col className="col-action">Action</Col>
            </Row>

            {filteredScreens.map((row) => (
                <Row key={row.tech_screen_id} className="data-row">
                    <Col className="col-job-content">
                        {`${row.job_code || ""} - ${row.job_title || ""}`}
                    </Col>
                    <Col className="col-client">{row.candidate_name}</Col>
                    <Col className="col-recruiter">{row.tech_screener_name}</Col>
                    <Col className="col-end-client">
                        {row.screening_date ? formatDateMMDDYYYY(row.screening_date) : ""}
                    </Col>
                    <Col className="col-job-status">{row.screening_status_name}</Col>
                    {/* <Col className="col-job-status" title={row.feedback || ""}>
                        {(row.feedback || "").length > 60
                            ? `${row.feedback.slice(0, 60)}…`
                            : row.feedback}
                    </Col> */}
                    <Col className="col-action">
                        <button aria-label="View" title="View" onClick={() => handleView(row.tech_screen_id)}>
                            <FaEye />
                        </button>
                        <button aria-label="Edit" title="Edit" onClick={() => handleEdit(row.tech_screen_id)}>
                            <FaEdit />
                        </button>
                        <button aria-label="Delete" title="Delete" onClick={() => handleDelete(row.tech_screen_id)}>
                            <FaTrash />
                        </button>
                    </Col>
                </Row>
            ))}

            <Modal show={show} onHide={handleClose} size="xl" dialogClassName="submission-modal">
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body style={{ width: "100%" }}>
                    <TechScreenComponent
                        tech_screen_id={currentId}
                        viewtype={viewtype}
                        externaldropdowndata={filterDropdownData}
                        onSuccess={async () => {
                            await refreshCurrentPage();
                            handleClose();
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Row className="justify-content-center mt-3">
                <Pagination>
                    <Pagination.First
                        onClick={() => handlePageChange(1)}
                        disabled={paginationData.currentpage === 1}
                    />
                    <Pagination.Prev
                        onClick={() => handlePageChange(Math.max(paginationData.currentpage - 1, 1))}
                        disabled={paginationData.currentpage === 1}
                    />
                    <Pagination.Item
                        key={1}
                        active={1 === paginationData.currentpage}
                        onClick={() => handlePageChange(1)}
                    >1</Pagination.Item>
                    {paginatedItemGenerate()}
                    <Pagination.Next
                        onClick={() => handlePageChange(Math.min(paginationData.currentpage + 1, paginationData.totalpages))}
                        disabled={paginationData.currentpage === paginationData.totalpages}
                    />
                    <Pagination.Last
                        onClick={() => handlePageChange(paginationData.totalpages)}
                        disabled={paginationData.currentpage === paginationData.totalpages}
                    />
                </Pagination>
            </Row>
        </div>
    );
};

export default AllTechScreens;
