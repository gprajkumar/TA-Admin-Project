import { useCallback, useEffect, useState } from "react";

export default function useCalTAT(submission_date, fetchedJobs, jobId) {
  const [tat, setTAT] = useState(null);
console.log("jobId",jobId);
  console.log("fetchedJobs",fetchedJobs);
  const calcTurnAroundTime = useCallback(() => {
    if (submission_date && fetchedJobs.length > 0 && jobId) {
      const job = fetchedJobs.find((job) => job.requirement_id === jobId);
      if (job && job.req_opened_date) {
        const openedDate = new Date(job.req_opened_date);
        const submissionDate = new Date(submission_date);
         if(openedDate > submissionDate){
     alert("Submission date should be greater than Opened date");
     return;
     }
        let count = 0;
        let date = new Date(openedDate);
console.log("openedDate",openedDate);
        console.log("submissionDate",submissionDate);
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
  }, [submission_date, jobId,fetchedJobs]);

  useEffect(() => {
    const result = calcTurnAroundTime();
    if (result !== null) {
      setTAT(result);
    }
  }, [calcTurnAroundTime]);

  return tat;
}
