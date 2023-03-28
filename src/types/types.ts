export interface UserWithBillable {
  Group: string;
  New: number;
  "Accuracy Optimization Service": number;
  Company: string;
  "Billable forecast": null | number;
  Enabled: 1 | 0;
  Plan: string;
  "Last name": string;
  "Non-billable": 1 | 0;
  Active: number;
  "Enabled through": string;
  Username: string;
  "Trial expiration": null | string;
  Total: number;
  Inactive: 1 | 0;
  "First name": string;
  Division: string;
}

export interface UserWithLastActive {
  Status: null | string;
  "Client group": string;
  Username: string;
  "Active account": number;
  "First name": string;
  "Last activity time": null | number;
  "Last sign in time": null | number;
  "Last name": string;
  "Active shortcut": number;
  "Active dictation": number;
}

export type CombinedData = UserWithBillable & {
  "Last activity time": null | number;
  "Last sign in time": null | number;
};
