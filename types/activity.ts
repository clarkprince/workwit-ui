export interface Activity {
  id: number;
  activity1: string;
  activity2: string;
  process: string;
  successful: boolean;
  message: string | null;
  tenant: string;
  createdAt: string;
}

export interface ActivityListResponse {
  data: Activity[];
  page: number;
  pageSize: number;
  records: number;
  recordsTotal: number;
  totalPages: number;
}
