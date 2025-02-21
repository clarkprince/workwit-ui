export interface Invoice {
  id: number;
  num: number;
  reference: string | null;
  job: {
    id: string;
    num: string;
  };
  customer: {
    id: number;
    name: string;
    myId: string;
  };
  vat: string;
  name: string;
  address: string;
  description: string | null;
  site: string | null;
  type: string;
  status: string;
  paymentDate: string | null;
  dateCreated: string;
  dateChanged: string;
  dueDate: string | null;
  subTotal: number;
  taxAmt: number;
  total: number;
  lines: InvoiceLine[];
}

export interface InvoiceLine {
  description: string;
  partProductCode: string;
  taxRate: string;
  discountPercent: string;
  discountAmount: string;
  quantity: string;
  unitPrice: string;
  subTotal: string;
  taxAmt: string;
  total: string;
}

export interface InvoiceListResponse {
  page: number;
  pageSize: number;
  records: number;
  recordsTotal: number;
  data: Invoice[];
}
