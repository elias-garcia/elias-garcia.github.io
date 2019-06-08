import React from 'react';
import JobsData from '../../assets/data/jobs.json';
import './Jobs.css';

const Job = ({ job }) => (
  <div className="Job">
    <h3 className="Job-role">{job.role}</h3>
    <p className="Job-company">
      @
      {job.company}
    </p>
    <p className="Job-dates">
      {job.startDate}
      {' '}
      -
      {' '}
      {job.endingDate}
    </p>
    <button
      type="button"
      className="Job-read-more-button"
    >
      Read more
    </button>
  </div>
);

const Jobs = () => (
  <div className="Jobs">
    {JobsData.map((job, i) => <Job job={job} key={i} />)}
  </div>
);

export default Jobs;
