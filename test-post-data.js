// Test script to simulate backend posting job data to the frontend
// Usage: node test-post-data.js
// Note: Requires Node.js 18+ (includes built-in fetch API)

const sampleJobsData = {
  rows: [
    {
      location: "Berlin, Germany",
      website: "https://example-company.com",
      websiteToJobs: "https://example-company.com/careers",
      hasJob: true,
      name: "Senior Software Engineer",
      salary: "€70,000 - €90,000",
      homeOfficeOption: true,
      period: "Full-time",
      employmentType: "Permanent",
      applicationDate: "2025-10-15",
      comments: "Great company culture, flexible hours",
      foundOn: "LinkedIn",
      occupyStart: "2025-12-01"
    },
    {
      location: "Munich, Germany",
      website: "https://another-company.com",
      websiteToJobs: "https://another-company.com/jobs",
      hasJob: true,
      name: "Frontend Developer",
      salary: "€60,000 - €75,000",
      homeOfficeOption: false,
      period: "Full-time",
      employmentType: "Contract",
      applicationDate: "2025-10-20",
      comments: "Need to relocate",
      foundOn: "Indeed",
      occupyStart: "2026-01-15"
    },
    {
      location: "Hamburg, Germany",
      website: "https://tech-startup.io",
      websiteToJobs: "https://tech-startup.io/careers",
      hasJob: true,
      name: "Full Stack Developer",
      salary: "€65,000 - €85,000",
      homeOfficeOption: true,
      period: "Full-time",
      employmentType: "Permanent",
      applicationDate: "2025-10-25",
      comments: "Startup environment, equity options",
      foundOn: "Company Website",
      occupyStart: "2025-11-20"
    }
  ]
};

const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}/api/jobs`;

console.log(`Posting job data to ${url}...`);
console.log(`Number of jobs: ${sampleJobsData.rows.length}`);

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(sampleJobsData)
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    console.log('\nYou can now view the jobs in the frontend at http://localhost:3000');
  })
  .catch(error => {
    console.error('Error:', error);
    console.error('\nMake sure the server is running with: yarn start');
  });
