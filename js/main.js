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

  function openJobFormPopup() {
    const jobPopup = $('#add-job-popup');
    const popupContent = $('.form-popup-content');

    const jobDetailsHTML = `
    <div id="close-form-popup" class="delete-button">×</div>
    <h2>Add New Job</h2>
    <form id="add-job-form">
      <label for="position">Position:</label>
      <input type="text" id="position" name="position" required>

      <label for="company">Company:</label>
      <input type="text" id="company" name="company" required>

      <label for="logo">Company Logo:</label>
      <input type="file" id="logo" name="logo" accept="image/*">

      <div class="checkbox-container">
      <label for="new">New Job:</label>
      <input type="checkbox" id="new" name="new">

      <label for="featured">Featured Job:</label>
      <input type="checkbox" id="featured" name="featured">
      </div>
      <label for="role">Role:</label>
      <input type="text" id="role" name="role" required>

      <label for="level">Level:</label>
      <input type="text" id="level" name="level" required>

      <label for="postedAt">Posted At:</label>
      <input type="text" id="postedAt" name="postedAt" required>

      <label for="contract">Contract:</label>
      <input type="text" id="contract" name="contract" required>

      <label for="location">Location:</label>
      <input type="text" id="location" name="location" required>

      <label for="languages">Languages (comma-separated):</label>
      <input type="text" id="languages" name="languages" required>

      <label for="tools">Tools (comma-separated):</label>
      <input type="text" id="tools" name="tools" required>

      <button type="submit">Add Job</button>

    </form>
  `;

    popupContent.html(jobDetailsHTML);

    // Show the popup
    jobPopup.css('display', 'flex');

    const closePopupBtn = $('#close-form-popup');

    // Close the popup when the close button is clicked
    closePopupBtn.click(function () {
      jobPopup.hide();
    });

    // function to submit the form
    const addJobForm = document.getElementById('add-job-form');
    addJobForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      console.log('Form submitted');

      // Get user input from the form
      const position = $('#position').val();
      const company = $('#company').val();
      const logoFile = $('#logo')[0].files[0]; // Get the selected logo file
      const isNew = $('#new').prop('checked');
      const isFeatured = $('#featured').prop('checked');
      const role = $('#role').val();
      const level = $('#level').val();
      const postedAt = $('#postedAt').val();
      const contract = $('#contract').val();
      const location = $('#location').val();
      const languages = $('#languages').val().split(',').map(lang => lang.trim());
      const tools = $('#tools').val().split(',').map(tool => tool.trim());

      const formData = new FormData();
      formData.append('logo', logoFile); // Append the logo file to the form data

      // Send the form data to the server
      try {
        // Send the form data to the server for file upload
        const response = await fetch('/upload-logo', {
          method: 'POST',
          body: formData,
        });

        if (response.status === 200) {
          console.log('Logo uploaded successfully');
          const logoFileName = await response.text(); // Get the logo file name from the server response

          // Close the Add Job Pop-up
          $('#add-job-popup').hide();

          // Add the new job to the job listings
          // Create a new job object
          const newJob = {
            company: company,
            logo: `uploads/${logoFileName}`,
            new: isNew,
            featured: isFeatured,
            position: position,
            role: role,
            level: level,
            postedAt: postedAt,
            contract: contract,
            location: location,
            languages: languages,
            tools: tools,
          };

          // Add the new job to your existing list (jobData)
          jobData.push(newJob);

          // Close the Add Job Pop-up
          $('#add-job-popup').hide();

          // Add the new job to the job listings
          const jobCardHTML = createJobCard(newJob, jobData.indexOf(newJob));
          jobListingsContainer.append(jobCardHTML);

          // Clear form fields
          $('#position').val('');
          $('#company').val('');
          $('#logo').val('');
          $('#new').prop('checked', false);
          $('#featured').prop('checked', false);
          $('#role').val('');
          $('#level').val('');
          $('#postedAt').val('');
          $('#contract').val('');
          $('#location').val('');
          $('#languages').val('');
          $('#tools').val('');        } else {
          console.error('Logo upload failed');
        }
      } catch (error) {
        console.error('Error uploading logo:', error);
      }


      return false;
    },false);
  }

  $('#add-job-button').click(function () {
    openJobFormPopup();
  });

});
