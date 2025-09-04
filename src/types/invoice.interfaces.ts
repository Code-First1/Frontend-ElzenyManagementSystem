import { createCrudApi } from "../services/apiCrud";

export interface Invoice {
  id: number;
  total: number;
  userName: string;
  dateTime: string;
  invoiceProduct: InvoiceProduct[];
}

export interface InvoiceProduct {
  productName: string;
  // unit: UnitValue;
  pricePerUnit: number;
  quantity: number;
}

export interface CreateInvoice {
  shopId: number;
  items: { productId: number; quantity: number; typing: boolean }[];
}

export interface UpdateInvoice {
  shopId: number;
  totalPrice: number;
}

export interface GetAllInvoicesResponse {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: Invoice[];
}
/////////////////////////////////// Create API instances //////////////////////////////
export const InvoiceApi = createCrudApi<Invoice, CreateInvoice, UpdateInvoice>(
  "invoices",
);
