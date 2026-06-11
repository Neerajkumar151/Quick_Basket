import { PaymentSetupConfig, PaymentSetupFormValues } from "../types/paymentSetup";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockConfig: PaymentSetupConfig = {
  businessName: "",
  merchantId: "",
  bankAccount: {
    accountName: "",
    accountNumber: "",
    ifscCode: "",
  },
  merchantIdentification: {
    panNumber: "",
    gstNumber: "",
  },
  integrationStatus: "Not Connected",
  verificationStatus: "Not Started",
  isOnlinePaymentEnabled: false,
};


export const paymentSetupService = {
  getConfig: async (): Promise<PaymentSetupConfig> => {
    await delay(600);
    return { ...mockConfig };
  },

  saveConfig: async (data: PaymentSetupFormValues): Promise<PaymentSetupConfig> => {
    await delay(800);
    
    mockConfig = {
      ...mockConfig,
      businessName: data.businessName,
      merchantId: data.merchantId,
      bankAccount: {
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
      },
      merchantIdentification: {
        panNumber: data.panNumber,
        gstNumber: data.gstNumber,
      },
    };
    
    return { ...mockConfig };
  },

  connectRazorpay: async (): Promise<PaymentSetupConfig> => {
    await delay(1500); // Simulate OAuth connection
    
    mockConfig = {
      ...mockConfig,
      integrationStatus: "Pending Verification",
      verificationStatus: "Pending Verification",
      pendingRequirements: [
        "Upload Business PAN Card copy",
        "Upload GST Certificate",
        "Verify Bank Account Penny Drop"
      ]
    };
    
    return { ...mockConfig };
  },

  disconnectRazorpay: async (): Promise<PaymentSetupConfig> => {
    await delay(1000); // Simulate disconnection
    
    mockConfig = {
      ...mockConfig,
      integrationStatus: "Disconnected",
      verificationStatus: "Not Started",
      isOnlinePaymentEnabled: false, // Automatically disable online payments
      merchantId: "",
      pendingRequirements: [],
      verificationRemarks: "",
      gatewayDetails: undefined,
    };
    
    return { ...mockConfig };
  },

  checkVerificationStatus: async (): Promise<PaymentSetupConfig> => {
    await delay(1200);
    
    // Toggle between Verified and Verification Failed for testing
    const isSuccess = Math.random() > 0.5;
    
    if (isSuccess) {
      mockConfig = {
        ...mockConfig,
        integrationStatus: "Connected",
        verificationStatus: "Verified",
        pendingRequirements: [],
        verificationRemarks: "",
        gatewayDetails: {
          merchantAccountStatus: "Active",
          kycStatus: "Completed",
          gatewayActivationStatus: "Activated",
        }
      };
    } else {
      mockConfig = {
        ...mockConfig,
        integrationStatus: "Verification Failed",
        verificationStatus: "Verification Failed",
        pendingRequirements: [],
        verificationRemarks: "Name mismatch found on PAN card. Please provide the exact name as printed on the physical document.",
        gatewayDetails: {
          merchantAccountStatus: "Suspended",
          kycStatus: "Rejected",
          gatewayActivationStatus: "Pending",
        }
      };
    }
    
    return { ...mockConfig };
  },

  retryVerification: async (): Promise<PaymentSetupConfig> => {
    await delay(1000);
    
    mockConfig = {
      ...mockConfig,
      integrationStatus: "Pending Verification",
      verificationStatus: "Under Review",
      pendingRequirements: [],
      verificationRemarks: "",
      gatewayDetails: {
        merchantAccountStatus: "Inactive",
        kycStatus: "Pending",
        gatewayActivationStatus: "Pending",
      }
    };
    
    return { ...mockConfig };
  },

  toggleOnlinePayments: async (enabled: boolean): Promise<PaymentSetupConfig> => {
    await delay(400);
    
    if (enabled && mockConfig.verificationStatus !== "Verified") {
      throw new Error("Cannot enable online payments without a verified connection");
    }
    
    mockConfig = {
      ...mockConfig,
      isOnlinePaymentEnabled: enabled,
    };
    
    return { ...mockConfig };
  }
};
