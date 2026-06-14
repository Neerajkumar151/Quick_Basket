export type PaymentIntegrationStatus = "Not Connected" | "Pending Verification" | "Connected" | "Verification Failed" | "Disconnected";
export type VerificationStatus = "Not Started" | "Pending Verification" | "Under Review" | "Verified" | "Verification Failed";

export interface GatewayDetails {
  merchantAccountStatus: "Active" | "Inactive" | "Suspended";
  kycStatus: "Pending" | "Completed" | "Rejected";
  gatewayActivationStatus: "Activated" | "Pending";
}

export interface BankAccountDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface MerchantIdentification {
  panNumber: string;
  gstNumber?: string;
}

export interface PaymentSetupConfig {
  businessName: string;
  merchantId?: string;
  bankAccount: BankAccountDetails;
  merchantIdentification: MerchantIdentification;
  integrationStatus: PaymentIntegrationStatus;
  verificationStatus: VerificationStatus;
  verificationRemarks?: string;
  pendingRequirements?: string[];
  gatewayDetails?: GatewayDetails;
  isOnlinePaymentEnabled: boolean;
}

// Zod Schema mapping
export interface PaymentSetupFormValues {
  businessName: string;
  merchantId: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  gstNumber?: string;
}
