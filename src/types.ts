export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type TransactionStatus = 'approved' | 'declined' | 'review' | 'challenged';

export interface RiskFactor {
  name: string;
  score: number; // 0 to 100
  weight: number;
  description: string;
  category: 'velocity' | 'geo' | 'device' | 'amount' | 'merchant' | 'behavior';
}

export interface Transaction {
  id: string;
  timestamp: string;
  customerName: string;
  customerId: string;
  customerEmail: string;
  accountAgeDays: number;
  amount: number;
  currency: string;
  merchantName: string;
  merchantCategory: string;
  location: {
    city: string;
    country: string;
    ip: string;
    ipRiskScore: number;
  };
  deviceInfo: {
    deviceType: string;
    os: string;
    browser: string;
    isNewDevice: boolean;
    isVpnOrProxy: boolean;
  };
  cardInfo: {
    brand: string;
    last4: string;
    issuingCountry: string;
    cvvMatch: boolean;
    avsMatch: boolean;
  };
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  status: TransactionStatus;
  riskFactors: RiskFactor[];
  aiExplanation?: string;
  ragMatches?: {
    caseId: string;
    similarity: number;
    description: string;
    outcome: string;
  }[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'velocity' | 'geo' | 'device' | 'amount' | 'merchant';
  weight: number; // 1 to 5
  enabled: boolean;
  triggerCount: number;
  action: 'decline' | 'flag' | 'challenge';
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'Head of Risk Operations' | 'Payments Product Manager' | 'Compliance Officer';
  avatar: string;
  provider: 'google' | 'github' | 'email';
}

export interface AnalyticsData {
  timeSeries: {
    date: string;
    totalTransactions: number;
    approved: number;
    declined: number;
    falsePositives: number;
    fraudLossSaved: number;
  }[];
  retentionData: {
    cohort: string;
    size: number;
    w1: number;
    w2: number;
    w3: number;
    w4: number;
  }[];
  featureUsage: {
    feature: string;
    activeUsers: number;
    monthlyCalls: number;
    growth: number;
  }[];
  dauData: {
    date: string;
    dau: number;
    mau: number;
  }[];
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  relatedTransactionId?: string;
  dataSummary?: Record<string, any>;
}
