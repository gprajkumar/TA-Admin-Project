import React from "react";
import { useParams } from "react-router-dom";

export default function ComingSoon() {
  const { feature } = useParams();

  // Map param to a nicer title
  const featureNames = {
    formatter: "AI Resume Formatter",
    booleangenerator: "AI Boolean String Generator",
    profileranker: "AI Resume Ranker",
    recruiterdashboard: "Recruiter Dashboard",
    sourcerdashboard: "Sourcer Dashboard"

  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 bg-white shadow rounded-3">
        <div className="display-1 mb-3">🚧</div>
        <h1 className="mb-3">{featureNames[feature] || "Coming Soon"}</h1>
        <p className="text-muted">
          This page is still under development. Please check back later!
        </p>
      </div>
    </div>
  );
}
