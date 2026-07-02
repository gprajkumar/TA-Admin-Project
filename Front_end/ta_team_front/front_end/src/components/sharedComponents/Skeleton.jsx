import React from "react";
import "./Skeleton.css";

export const Skeleton = ({ className = "", style }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const ScoreCardSkeleton = () => (
  <div className="scorecard scorecard-skeleton" aria-hidden="true">
    <Skeleton className="scorecard-skeleton-title" />
    <div className="scorecard-skeleton-body">
      <Skeleton className="scorecard-skeleton-value" />
    </div>
  </div>
);

export const ScoreCardRowSkeleton = ({ count = 6, className = "" }) => (
  <div className={`scorecard-row ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <ScoreCardSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 6, className = "", withTitle = false }) => (
  <div className={`skeleton-table ${className}`} aria-hidden="true">
    {withTitle && <Skeleton className="skeleton-table-title" />}
    <div className="skeleton-table-row skeleton-table-head">
      {Array.from({ length: cols }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
    {Array.from({ length: rows }, (_, r) => (
      <div className="skeleton-table-row" key={r}>
        {Array.from({ length: cols }, (_, c) => (
          <Skeleton key={c} />
        ))}
      </div>
    ))}
  </div>
);

const BAR_HEIGHTS = [55, 80, 40, 95, 65, 75, 50, 85];

export const ChartSkeleton = ({ className = "", variant = "bars" }) => (
  <div
    className={`skeleton-chart ${variant === "pie" ? "skeleton-chart--pie" : ""} ${className}`}
    aria-hidden="true"
  >
    {variant === "pie" ? (
      <Skeleton className="skeleton-pie" />
    ) : (
      BAR_HEIGHTS.map((h, i) => (
        <Skeleton key={i} className="skeleton-bar" style={{ height: `${h}%` }} />
      ))
    )}
  </div>
);
