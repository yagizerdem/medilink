export interface StockEntity {
  pharmacistUid: string;
  uid: string;
  barcode: string;
  medicineName: string;
  dosage: string;
  formType: string;
  frequency: string;
  startDate: string;
  endDate: string;
  stockAmount: number;
}
