export type Gender = "male" | "female";

export interface PersonalData {
  phone: string;
  firstName: string;
  lastName: string;
  gender: Gender | "";
}

export interface AddressData {
  workplace: string;
  address: string;
}

export interface LoanData {
  amount: number;
  term: number;
}

export interface ApplicationData extends PersonalData, AddressData, LoanData {}
