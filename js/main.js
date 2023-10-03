// script.js

import $ from 'jquery';
import json from '../data/data.json';
$(document).ready(function() {
  const jobData = [
    {
      "id": 1,
      "company": "Photosnap",
      "logo": "photosnap.svg",
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
      "logo": "manage.svg",
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
      <div class="job-image">
        <img src="${job.logo}" alt="${job.company} Logo">
      </div>
      <div class="job-details">
        <div class="company-info">
          <h2>${job.company}</h2>
          ${job.new ? '<span class="new">New!</span>' : ''}
          ${job.featured ? '<span class="featured">Featured</span>' : ''}
        </div>
        <p class="role">${job.position}</p>
        <div class="job-meta">
          <p>${job.postedAt} • ${job.contract} • ${job.location}</p>
          <p class="level">${job.role} • ${job.level}</p>
        </div>
      </div>
      <div class="job-skills">
        <p class="languages">Languages: ${job.languages.join(', ')}</p>
        <p class="tools">Tools: ${job.tools.join(', ')}</p>
      </div>
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
