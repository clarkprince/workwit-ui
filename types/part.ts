export interface Part {
  id: string;
  reference: string;
  name: string;
  description?: string;
  price: string;
  minQuantity?: number;
  isTracked?: boolean;
  isSerializable?: boolean;
  status: string;
  type?: string;
  category: {
    id: string;
    name: string;
  };
  tax?: {
    id: string;
  };
}

export interface QueuedPart {
  queueId: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  fileName: string;
  totalParts: number;
  processedParts: number;
  failedParts: number;
  errorDetails?: string;
  part: Part;
}

export interface QueuedPartsListResponse {
  queuedParts: {
    content: QueuedPart[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  parts?: {
    data: Part[];
    recordsTotal: number;
  };
}

export interface PartListResponse {
  data: Part[];
  recordsTotal: number;
  page: number;
  pageSize: number;
}

export type QueuedPartsResponse = {
  content: QueuedPart[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export interface UploadResponse {
  queueId: number;
  message: string;
}

export interface UploadStatus {
  id: number;
  fileName: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  totalParts: number;
  processedParts: number;
  failedParts: number;
  errorDetails?: string;
  createdAt: string;
  processedAt?: string;
}
