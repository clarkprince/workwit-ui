export interface Customer {
  "@url": string;
  Address1: string;
  Address2: string | null;
  City: string;
  Country: string;
  Comments: string | null;
  Currency: string;
  CostCenter: string | null;
  CountryCode: string;
  Active: boolean;
  CustomerNumber: string;
  DefaultDeliveryTypes: {
    Invoice: string;
    Order: string;
    Offer: string;
  };
  DefaultTemplates: {
    Order: string;
    Offer: string;
    Invoice: string;
    CashInvoice: string;
  };
  DeliveryAddress1: string | null;
  DeliveryAddress2: string | null;
  DeliveryCity: string | null;
  DeliveryCountry: string | null;
  DeliveryCountryCode: string | null;
  DeliveryFax: string | null;
  DeliveryName: string | null;
  DeliveryPhone1: string | null;
  DeliveryPhone2: string | null;
  DeliveryZipCode: string | null;
  Email: string;
  EmailInvoice: string;
  EmailInvoiceBCC: string;
  EmailInvoiceCC: string;
  EmailOffer: string;
  EmailOfferBCC: string;
  EmailOfferCC: string;
  EmailOrder: string;
  EmailOrderBCC: string;
  EmailOrderCC: string;
  ExternalReference: string | null;
  Fax: string;
  GLN: string | null;
  GLNDelivery: string | null;
  InvoiceAdministrationFee: number | null;
  InvoiceDiscount: number | null;
  InvoiceFreight: number | null;
  InvoiceRemark: string;
  Name: string;
  OrganisationNumber: string;
  OurReference: string;
  Phone1: string;
  Phone2: string | null;
  PriceList: string;
  Project: string;
  SalesAccount: string | null;
  ShowPriceVATIncluded: boolean;
  TermsOfDelivery: string;
  TermsOfPayment: string;
  Type: string;
  VATNumber: string;
  VATType: string;
  VisitingAddress: string | null;
  VisitingCity: string | null;
  VisitingCountry: string | null;
  VisitingCountryCode: string | null;
  VisitingZipCode: string | null;
  WayOfDelivery: string;
  WWW: string;
  YourReference: string;
  ZipCode: string;
}

export interface CustomerListResponse {
  MetaInformation: {
    "@TotalResources": number;
    "@TotalPages": number;
    "@CurrentPage": number;
  };
  Customers: Customer[];
}
