import React from 'react';
import JobsData from '../../assets/data/jobs.json';
import './Jobs.css';

const Job = ({ job }) => (
  <div className="Job">
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
    <p className="Job-description">{job.description}</p>
    {/* <button
      type="button"
      className="Job-read-more-button"
    >
      Read more
    </button> */}
  </div>
);

const Jobs = () => (
  <div className="Jobs">
    {JobsData.map((job, i) => <Job job={job} key={i} />)}
  </div>
);

export default Jobs;
