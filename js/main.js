// script.js

import $ from 'jquery';
import json from '../data/data.json';
$(document).ready(function() {
  const jobData =  json;

  // Function to create a job card HTML element
  function createJobCard(job) {
    const languagesPill = job.languages.map(language => `<span class="filter-pill">${language}</span>`).join('');
    const rolePill = `<span class="filter-pill">${job.role}</span>`;
    const levelPill = `<span class="filter-pill">${job.level}</span>`;
    const toolsPill = job.tools.map(tool => `<span class="filter-pill">${tool}</span>`).join('');


    return `
    <div class="job-card">
      <div class="job-image">
    <img src="${job.logo}" alt="${job.company} Logo" class="job-image">
      </div>
      <div class="job-details">
        <div class="company-info">
          <h2>${job.position}</h2> <!-- Swap position and company name -->
          ${job.new ? '<span class="new">New!</span>' : ''}
          ${job.featured ? '<span class="featured">Featured</span>' : ''}
        </div>
        <p class="role">${job.company}</p> <!-- Swap company name and position -->
        <div class="job-meta">
          <p>${job.postedAt} • ${job.contract} • ${job.location}</p>
        </div>
      </div>
      <div class="job-skills">
        ${languagesPill}
        ${rolePill}
        ${levelPill}
        ${toolsPill}
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
