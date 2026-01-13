import { useCallback, useEffect, useState } from "react";
import {tatCount} from "../../services/drop_downService.js";

export default function useCalTAT(submission_date, fetchedJobs, jobId) {
  const [tat, setTAT] = useState(null);
  const calcTurnAroundTime = useCallback(async () => {
    if (submission_date && fetchedJobs.length > 0 && jobId) {
  
      const job = fetchedJobs.find((job) => job.requirement_id === jobId);
      if (job && job.req_opened_date) {
      
        const openedDate = new Date(job.req_opened_date);
        const submissionDate = new Date(submission_date);
         if(openedDate > submissionDate){
     alert("Submission date should be greater than Opened date");
     return;
     }
       const tatCountres = await  tatCount(submission_date,job.req_opened_date);
        console.log("holidaysResponse",tatCountres);
//         let count = 0;
//         let date = new Date(openedDate);
// console.log("openedDate",openedDate);
//         console.log("submissionDate",submissionDate);
//         while (date <= submissionDate) {
//           if (date.getDay() !== 0 && date.getDay() !== 6) {
//             count++;
//           }
//           date.setDate(date.getDate() + 1);
//         }

        return tatCountres.tat;
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
