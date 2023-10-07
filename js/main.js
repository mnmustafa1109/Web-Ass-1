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
      const jobCardHTML = createJobCard(job, jobData.indexOf(job));
      jobListingsContainer.append(jobCardHTML);
    });
  }

  // Attach click event to the job skills pills to add them as filter pills
  jobListingsContainer.on('click', '.job-skills .filter-pill', function () {
    event.stopPropagation(); // Prevent the click event from propagating to the job card
    const filterText = $(this).text();
    if (!jobFiltersContainer.find('.filter-pill .filter-text:contains("' + filterText + '")').length) {
      addFilterPill(filterText);
    }
  });

  // Initial display of job listings
  jobData.forEach(function (job) {
    const jobCardHTML = createJobCard(job, jobData.indexOf(job));
    jobListingsContainer.append(jobCardHTML);
  });


  function createJobCard(job, index) {
    const languagesPill = job.languages.map((language) => `<span class="filter-pill">${language}</span>`).join('');
    const rolePill = `<span class="filter-pill">${job.role}</span>`;
    const levelPill = `<span class="filter-pill">${job.level}</span>`;
    const toolsPill = job.tools.map((tool) => `<span class="filter-pill">${tool}</span>`).join('');

    return `
    <div class="job-card-container" >
      <div class="job-card" data-job-id="${index}" data-role="${job.role}" data-level="${job.level}" data-languages="${job.languages.join(
      ', '
    )}" data-tools="${job.tools.join(', ')}">
        <div class="delete-button" data-job-id="${index}">×</div>
        <div class="job-image">
          <img src="${job.logo}" alt="${job.company} Logo" class="job-image">
        </div>
        <div class="job-details">
          <div class="company-info">
            <h2>${job.position}</h2>
            ${job.new ? '<span class="new">New!</span>' : ''}
            ${job.featured ? '<span class="featured">Featured</span>' : ''}
          </div>
          <p class="role">${job.company}</p>
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
    </div>
  `;
  }

  // Function to open the job popup
  function openJobPopup(job) {
    const jobPopup = $('#job-popup');
    const popupContent = $('.popup-content');

    // Populate the popup content with job details
    const languagesPill = job.languages.map(language => `<span class="filter-pill">${language}</span>`).join('');
    const rolePill = `<span class="filter-pill">${job.role}</span>`;
    const levelPill = `<span class="filter-pill">${job.level}</span>`;
    const toolsPill = job.tools.map(tool => `<span class="filter-pill">${tool}</span>`).join('');

    const jobDetailsHTML = `
          <div id="close-popup" class="delete-button" data-job-id="${jobData.indexOf(job)}">×</div>
    <div class="job-card-popup" data-job-id="${jobData.indexOf(job)}" data-role="${job.role}" data-level="${job.level}" data-languages="${job.languages.join(', ')}" data-tools="${job.tools.join(', ')}">
      <div class="job-image">
        <img src="${job.logo}" alt="${job.company} Logo" class="job-image">
      </div>
      <div class="job-details">
        <div class="company-info">
          <h2>${job.position}</h2>
          ${job.new ? '<span class="new">New!</span>' : ''}
          ${job.featured ? '<span class="featured">Featured</span>' : ''}
        </div>
        <p class="role">${job.company}</p>
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
      <!-- Add the delete button -->
    </div>
  `;

    popupContent.html(jobDetailsHTML);

    // Show the popup
    jobPopup.css('display', 'flex');

    const closePopupBtn = $('#close-popup');

    // Close the popup when the close button is clicked
    closePopupBtn.click(function () {
      jobPopup.hide();
    });
  }

  // Attach click event to job card company names to open the popup
  jobListingsContainer.on('click', '.job-card .job-details', function () {
    const jobId = $(this).closest('.job-card').data('job-id'); // Get the job ID from the closest job card
    const selectedJob = jobData[jobId]; // Find the job using the job ID
    if (selectedJob) {
      openJobPopup(selectedJob);
    }

  });

  function deleteJob(event, jobId) {
    event.stopPropagation();

    // Find the job card with the matching data-job-id attribute and remove it
    const jobCard = $(`.job-card[data-job-id="${jobId}"]`);
    jobCard.remove();
    console.log(jobId);

    // Remove the job from the jobData array
    const indexToDelete = jobData.findIndex(job => jobData.indexOf(job) === jobId);
    if (indexToDelete !== -1) {
      jobData.splice(indexToDelete, 1);
    }
  }



  jobListingsContainer.on('click', '.delete-button', function (event) {
    const jobId = $(this).closest('.job-card').data('job-id'); // Get the job ID from data attribute
    deleteJob(event, jobId); // Pass the event to the deleteJob function with the job's ID
  });

});
