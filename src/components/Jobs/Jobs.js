import React from 'react';
import JobsData from '../../assets/data/jobs.json';
import './Jobs.css';

const getJobs = () => JobsData.map((job, i) => (
  <div className="Job" key={i}>
    <h3 className="Job-role">{job.role}</h3>
    <a
      className="Job-company"
      href={job.website}
      target="_blank"
      rel="noopener noreferrer"
    >
      @
      {job.company}
    </a>
    <p className="Job-dates">
      {job.startDate}
      {' '}
      -
      {' '}
      {job.endingDate}
    </p>
  </div>
));

const Jobs = () => (
  <div className="Jobs">
    {getJobs()}
  </div>
);

export default Jobs;
