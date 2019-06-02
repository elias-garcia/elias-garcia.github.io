import React from 'react';
import JobsData from '../../assets/data/jobs.json';
import './Jobs.css';

function getJobs() {
  return JobsData.map((job, i) => {
    return (
      <div className="Jobs-element" key={i}>
        <h3 className="Jobs-element-role">{job.role}</h3>
        <a
          className="Jobs-element-company"
          href={job.website}
          target="_blank"
          rel="noopener noreferrer">
          @{job.company}
        </a>
        <p className="Jobs-element-dates">{job.startDate} - {job.endingDate}</p>
      </div>
    );
  })
}

function Jobs() {
  return (
    <div className="Jobs">
      {getJobs()}
    </div>
  );
}

export default Jobs;