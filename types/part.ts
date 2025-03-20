export interface Part {
  id: number;
  name: string;
  description: string;
  reference: string;
  price: string;
  minQuantity: number;
  isTracked: boolean;
  isSerializable: boolean;
  category: {
    id: number;
    name: string;
  };
  tax: {
    id: number;
    name: string;
    rate: number;
  };
  dateModified: string;
  status: string;
  type: string;
}

export interface PartListResponse {
  page: number;
  pageSize: number;
  records: number;
  recordsTotal: number;
  data: Part[];
}
