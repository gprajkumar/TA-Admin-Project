import { useCallback, useEffect, useState } from "react";

export default function useCalTAT(submission_date, fetchedJobs, jobId) {
  const [tat, setTAT] = useState(null);

  const calcTurnAroundTime = useCallback(() => {
    if (submission_date && fetchedJobs.length > 0 && jobId) {
      const job = fetchedJobs.find((job) => job.requirement_id === jobId);
      if (job && job.req_opened_date) {
        const openedDate = new Date(job.req_opened_date);
        const submissionDate = new Date(submission_date);
        let count = 0;
        let date = new Date(openedDate);

        while (date <= submissionDate) {
          if (date.getDay() !== 0 && date.getDay() !== 6) {
            count++;
          }
          date.setDate(date.getDate() + 1);
        }

        return count;
      }
    }
    return null;
  }, [submission_date, jobId]);

  useEffect(() => {
    const result = calcTurnAroundTime();
    if (result !== null) {
      setTAT(result);
    }
  }, [calcTurnAroundTime]);

  return tat;
}
