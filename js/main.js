import $ from 'jquery';
import json from '../data/data.json';

$(document).ready(function () {
  const jobData = json;
  const jobFiltersParent = $('#job-filters');
  const jobListingsContainer = $('#job-listings');
  const jobFiltersContainer = $('#job-filters-pills');
  const clearFilter = $('#clear-filter');

  function addFilterPill(filterText) {
    const filterPillHTML = `
      <div class="filter-pill">
        <span class="filter-text">${filterText}</span>
        <img src="icon-remove.svg" class="cross-icon" alt="Cross Icon">
      </div>
    `;
    jobFiltersContainer.append(filterPillHTML);

    jobFiltersContainer.find('.filter-pill').last().click(function () {
      $(this).remove();
      filterJobs();
    });

    jobFiltersParent.show();

    filterJobs();
  }

  clearFilter.click(function () {
    jobFiltersContainer.empty();
    filterJobs();
  });

  function filterJobs() {
    const selectedFilters = jobFiltersContainer.find('.filter-pill .filter-text').map(function () {
      return $(this).text();
    }).get();

    if (selectedFilters.length === 0) {

      jobFiltersContainer.hide();
      jobFiltersParent.hide();
    } else {

      jobFiltersContainer.show();

      jobFiltersContainer.css('display', 'flex');
      jobFiltersParent.show();
      jobFiltersParent.css('display', 'flex');
    }

    const filteredJobs = jobData.filter(job => {
      const jobSkills = [
        ...job.languages,
        job.role,
        job.level,
        ...job.tools
      ];
      return selectedFilters.every(filter => jobSkills.includes(filter));
    });

    jobListingsContainer.empty();
    filteredJobs.forEach(job => {
      const jobCardHTML = createJobCard(job, jobData.indexOf(job));
      jobListingsContainer.append(jobCardHTML);
    });
  }

  jobListingsContainer.on('click', '.job-skills .filter-pill', function () {
    event.stopPropagation();
    const filterText = $(this).text();
    if (!jobFiltersContainer.find('.filter-pill .filter-text:contains("' + filterText + '")').length) {
      addFilterPill(filterText);
    }
  });

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

  function openJobPopup(job) {
    const jobPopup = $('#job-popup');
    const popupContent = $('.popup-content');

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
    </div>
  `;

    popupContent.html(jobDetailsHTML);

    jobPopup.css('display', 'flex');

    const closePopupBtn = $('#close-popup');

    closePopupBtn.click(function () {
      jobPopup.hide();
    });
  }

  jobListingsContainer.on('click', '.job-card .job-details', function () {
    const jobId = $(this).closest('.job-card').data('job-id');
    const selectedJob = jobData[jobId];
    if (selectedJob) {
      openJobPopup(selectedJob);
    }

  });

  function deleteJob(event, jobId) {
    event.stopPropagation();

    const jobCard = $(`.job-card[data-job-id="${jobId}"]`);
    jobCard.remove();
    console.log(jobId);

    const indexToDelete = jobData.findIndex(job => jobData.indexOf(job) === jobId);
    if (indexToDelete !== -1) {
      jobData.splice(indexToDelete, 1);
    }
  }

  jobListingsContainer.on('click', '.delete-button', function (event) {
    const jobId = $(this).closest('.job-card').data('job-id');
    deleteJob(event, jobId);
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

    jobPopup.css('display', 'flex');

    const closePopupBtn = $('#close-form-popup');

    closePopupBtn.click(function () {
      jobPopup.hide();
    });

    const addJobForm = document.getElementById('add-job-form');
    addJobForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      console.log('Form submitted');

      const position = $('#position').val();
      const company = $('#company').val();
      const logoFile = $('#logo')[0].files[0];
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
      formData.append('logo', logoFile);

      try {

        const response = await fetch('/upload-logo', {
          method: 'POST',
          body: formData,
        });

        if (response.status === 200) {
          console.log('Logo uploaded successfully');
          const logoFileName = await response.text();

          $('#add-job-popup').hide();

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

          jobData.push(newJob);

          $('#add-job-popup').hide();

          const jobCardHTML = createJobCard(newJob, jobData.indexOf(newJob));
          jobListingsContainer.append(jobCardHTML);

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
