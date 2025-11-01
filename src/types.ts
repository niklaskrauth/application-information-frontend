export interface Job {
  location: string;
  website: string;
  websiteToJobs: string;
  hasJob: boolean;
  name: string | null;
  salary: string | null;
  homeOfficeOption: boolean | null;
  period: string | null;
  employmentType: string | null;
  applicationDate: string | null;
  comments: string | null;
  foundOn: string | null;
}

export interface JobsResponse {
  rows: Job[];
}
