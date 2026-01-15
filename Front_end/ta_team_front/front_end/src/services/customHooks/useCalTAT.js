import { useCallback, useEffect, useState } from "react";
import { tatCount } from "../../services/drop_downService.js";

export default function useCalTAT(submission_date, fetchedJobs, jobId) {
  const [tat, setTAT] = useState(null);

  const calcTurnAroundTime = useCallback(async () => {
    if (!submission_date || !Array.isArray(fetchedJobs) || fetchedJobs.length === 0 || !jobId) {
      return null;
    }

    const job = fetchedJobs.find((job) => job.requirement_id === jobId);
    if (!job || !job.req_opened_date) return null;

    const openedDate = new Date(job.req_opened_date);
    const submissionDate = new Date(submission_date);

    if (openedDate > submissionDate) {
      alert("Submission date should be greater than Opened date");
      return null;
    }

    const tatCountres = await tatCount(submission_date, job.req_opened_date);
    return tatCountres?.tat ?? null;
  }, [submission_date, jobId, fetchedJobs]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const result = await calcTurnAroundTime();
      if (!cancelled) {
        setTAT(result);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [calcTurnAroundTime]);

  return tat;
}
