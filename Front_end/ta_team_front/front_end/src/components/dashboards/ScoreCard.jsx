import React from 'react';

const ScoreCard = ({title,score}) => {
    return (
      
              <div className="scorecard">
              <p className="title">{title}</p>
              <p>{score || 0}</p>
            </div>
       
    );
}

export default ScoreCard;
