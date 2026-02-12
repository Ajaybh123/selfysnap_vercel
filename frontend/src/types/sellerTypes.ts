// src/types/seller.ts

export interface PickupAddress {
    name: string;
    mobile: string;
    pinCode: string;
    address: string;
    locality: string;
    city: string;
    state: string;
}

export interface BankDetails {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
}

export interface BusinessDetails {
    businessName: string;
}

export interface Seller {
    _id?:number;
    mobile: string;
    otp: string;
    GSTIN: string;
    pickupAddress: PickupAddress;
    bankDetails: BankDetails;
    sellerName: string;
    email: string;
    businessDetails: BusinessDetails;
    password: string;
    accountStatus?:string;
}

export interface SellerReport {
  _id: number;
  seller: Seller;
  totalEarnings: number;      // total revenue
  totalSales: number;         // total number of items/orders sold
  totalRefunds: number;       // total refunds amount
  totalTax: number;           // tax collected
  netEarnings: number;        // totalEarnings - totalCommission
  totalOrders: number;        // total orders
  canceledOrders: number;     // cancelled orders count
  totalTransactions: number;  // total payout transactions
  totalCommission: number;    // commission earned by the platform
  pendingPayout: number;      // amount pending to pay seller
}

