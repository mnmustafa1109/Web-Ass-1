// script.js

import $ from 'jquery';
import json from '../data/data.json';

$(document).ready(function () {
  const jobData = json;
  const jobFiltersParent = $('#job-filters'); // Select the job filters container
  const jobListingsContainer = $('#job-listings');
  const jobFiltersContainer = $('#job-filters-pills'); // Select the job filters container
  const clearFilter = $('#clear-filter'); // Select the clear filter paragraph

  // Function to create a filter pill and add it to the job filters container
  function addFilterPill(filterText) {
    const filterPillHTML = `
      <div class="filter-pill">
        <span class="filter-text">${filterText}</span>
        <img src="icon-remove.svg" class="cross-icon" alt="Cross Icon">
      </div>
    `;
    jobFiltersContainer.append(filterPillHTML);

    // Add click event to remove the filter pill when clicked
    jobFiltersContainer.find('.filter-pill').last().click(function () {
      $(this).remove();
      filterJobs(); // Reapply filtering after removing a pill
    });

    jobFiltersParent.show();

    filterJobs(); // Apply filtering when a new pill is added
  }

  // Attach click event to the "Clear" filter paragraph to remove all filter pills
  clearFilter.click(function () {
    jobFiltersContainer.empty();
    filterJobs(); // Reapply filtering after removing all pills
  });

  // Function to filter jobs based on selected filter pills
  function filterJobs() {
    const selectedFilters = jobFiltersContainer.find('.filter-pill .filter-text').map(function () {
      return $(this).text();
    }).get();

    // Check if there are any selected filters
    if (selectedFilters.length === 0) {
      // Hide the job filters container when there are no filters
      jobFiltersContainer.hide();
      jobFiltersParent.hide();
    } else {
      // Show the job filters container when there are filters
      jobFiltersContainer.show();
      // add flex to job listings
      jobFiltersContainer.css('display', 'flex');
      jobFiltersParent.show();
      jobFiltersParent.css('display', 'flex');
    }

    // Filter the job listings based on selected filters
    const filteredJobs = jobData.filter(job => {
      const jobSkills = [
        ...job.languages,
        job.role,
        job.level,
        ...job.tools
      ];
      return selectedFilters.every(filter => jobSkills.includes(filter));
    });

    // Clear the job listings container and display the filtered jobs
    jobListingsContainer.empty();
    filteredJobs.forEach(job => {
      const jobCardHTML = createJobCard(job);
      jobListingsContainer.append(jobCardHTML);
    });
  }

  // Attach click event to the job skills pills to add them as filter pills
  jobListingsContainer.on('click', '.job-skills .filter-pill', function () {
    const filterText = $(this).text();
    if (!jobFiltersContainer.find('.filter-pill .filter-text:contains("' + filterText + '")').length) {
      addFilterPill(filterText);
    }
  });

  // Initial display of job listings
  jobData.forEach(function (job) {
    const jobCardHTML = createJobCard(job);
    jobListingsContainer.append(jobCardHTML);
  });


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

  jobData.forEach(function (job) {
    const jobCardHTML = createJobCard(job);
    jobListingsContainer.append(jobCardHTML);
  });
});
