export interface Job {
  id: string;
  myId: string;
  num: number;
  description: string;
  priority: string;
  customer: {
    id: number;
    myId: string | null;
    name: string;
  };
  site: {
    id: number;
    myId: string;
    name: string;
  } | null;
  equipment: {
    id: number;
    myId: string;
    name: string;
  } | null;
  type: {
    id: number;
    name: string;
  };
  status: string;
  technician: {
    id: number;
    name: string;
    login: string;
  };
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  address: string;
  dateCreated: string;
  dateModified: string;
  preferences: {
    isDraft: boolean;
    isPool: boolean;
  };
  reportTemplate: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    login: string;
    name: string;
  };
  addressStreet: string;
  addressProvince: string | null;
  addressCity: string;
  addressZIP: string;
  addressCountry: string;
  addressComplement: string | null;
  contactFirstName: string | null;
  contactLastName: string | null;
  contactMobile: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  publicLink: string;
  createdByCustomer: boolean;
  otherTechnicians: any[];
  duration: number;
  parts: {
    id: number;
    quantity: number;
    reference: string;
    serialNumbers: string | null;
  }[];
  report: any[];
  position: {
    latitude: string;
    longitude: string;
  };
  customFieldValues: any[];
  timeEntries: {
    user: {
      id: number;
      name: string;
      login: string;
    };
    start: string;
    stop: string;
  }[];
  tags: string[];
  skills: string[];
  validateBy?: {
    id: number;
    login: string;
    name: string;
    date: string;
  };
}

export interface JobListResponse {
  page: number;
  pageSize: number;
  records: number;
  recordsTotal: number;
  data: Job[];
}
