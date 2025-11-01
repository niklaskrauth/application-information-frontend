export interface Job {
  location: string;
  website: string;
  websiteToJobs: string;
  hasJob: boolean;
  name: string;
  salary: string;
  homeOfficeOption: boolean;
  period: string;
  employmentType: string;
  applicationDate: string;
  comments: string;
}

export interface JobsResponse {
  rows: Job[];
}
