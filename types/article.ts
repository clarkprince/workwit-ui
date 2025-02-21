export interface Article {
  "@url": string;
  ArticleNumber: string;
  Bulky: boolean;
  ConstructionAccount: number;
  Depth: number | null;
  Description: string;
  DisposableQuantity: number;
  EAN: string;
  EUAccount: number;
  EUVATAccount: number;
  ExportAccount: number;
  Height: number | null;
  Housework: boolean;
  HouseworkType: string | null;
  Active: boolean;
  Manufacturer: string | null;
  ManufacturerArticleNumber: string | null;
  Note: string;
  PurchaseAccount: number;
  PurchasePrice: number;
  QuantityInStock: number;
  ReservedQuantity: number;
  SalesAccount: number;
  StockGoods: boolean;
  StockPlace: string;
  StockValue: number;
  StockWarning: number | null;
  SupplierName: string;
  SupplierNumber: string;
  Type: string;
  Unit: string;
  VAT: number;
  WebshopArticle: boolean;
  Weight: number | null;
  Width: number | null;
  Expired: boolean;
  SalesPrice: number;
  CostCalculationMethod: string;
  StockAccount: number | null;
  StockChangeAccount: number | null;
  DirectCost: number;
  FreightCost: number;
  OtherCost: number;
  DefaultStockPoint: string;
  DefaultStockLocation: string | null;
  CommodityCode: string | null;
}

export interface ArticleListResponse {
  Articles: Article[];
  MetaInformation: {
    "@TotalResources": number;
    "@TotalPages": number;
    "@CurrentPage": number;
  };
}
