// script.js

import $ from 'jquery';
import json from '../data/data.json';
$(document).ready(function() {
  const jobData = [
    {
      "id": 1,
      "company": "Photosnap",
      "logo": "./images/photosnap.svg",
      "new": true,
      "featured": true,
      "position": "Senior Frontend Developer",
      "role": "Frontend",
      "level": "Senior",
      "postedAt": "1d ago",
      "contract": "Full Time",
      "location": "USA Only",
      "languages": ["HTML", "CSS", "JavaScript"],
      "tools": []
    },
    {
      "id": 2,
      "company": "Manage",
      "logo": "./images/manage.svg",
      "new": true,
      "featured": true,
      "position": "Fullstack Developer",
      "role": "Fullstack",
      "level": "Midweight",
      "postedAt": "1d ago",
      "contract": "Part Time",
      "location": "Remote",
      "languages": ["Python"],
      "tools": ["React"]
    }];

  // Function to create a job card HTML element
  function createJobCard(job) {
    return `
    <div class="job-card">
      <h2>${job.company}</h2>
      ${job.new ? '<span>New!</span>' : ''}
      ${job.featured ? '<span>Featured</span>' : ''}
      <p class="role">${job.position}</p>
      <p>${job.postedAt}</p>
      <p>${job.contract}</p>
      <p>${job.location}</p>
      <p class="languages">${job.languages.join(', ')}</p>
    </div>
  `;
  }

  // Fetch and display job listings
  const jobListingsContainer = $('#job-listings');

  jobData.forEach(function(job) {
    const jobCardHTML = createJobCard(job);
    jobListingsContainer.append(jobCardHTML);
  });
});
