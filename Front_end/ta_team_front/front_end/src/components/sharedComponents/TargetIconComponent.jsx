import React from 'react'
import { useMemo } from 'react'
import './TargetIcon.css'
const converttoFloat = (value) => {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      const parsedValue = parseFloat(value.replace("%", "").trim());
      return isNaN(parsedValue) ? 0 : parsedValue;
    } else {
      return 0; 
    }
}

export const TargetIconComponent = ({ targetAchieved }) => {
    const targetachieved = converttoFloat(targetAchieved);
    const meta = useMemo(() => {
    if (targetachieved >= 80) return { cls: "success", icon: "✔", label: "On track" };
    if (targetachieved >= 50) return { cls: "warning", icon: "↗", label: "In progress" };
    return { cls: "danger", icon: "✖", label: "Behind target" };
  }, [targetachieved]);

  const showCrown = targetachieved === 100;
  return (
     <span className={`target-badge ${meta.cls}`} role="status">
      <span className="icon" aria-hidden="true">{meta.icon}</span>

      <span className="value">
        {targetachieved}%
        {showCrown && <span className="crown" title="Top performer">👑</span>}
      </span>

      {/* Tooltip */}
      <span className="tooltip" role="tooltip">
        {meta.label} • {targetachieved}%
      </span>
    </span>
  )
}
