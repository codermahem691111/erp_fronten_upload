export type PersonType = 'customer' | 'staff' | 'supplier';

export interface Person {
  id: string;
  companyId: string;
  personType: PersonType;
  name: string;
  details: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PersonPayload {
  personType: PersonType;
  name: string;
  details: string;
  email?: string;
  phone?: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  details: string;
  sellingPrice: number;
  buyingPrice: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  details: string;
  sellingPrice: number;
  buyingPrice: number;
  imageUrl?: string;
}

export type ExpenseCategory = 'staff_salary' | 'product_buying' | 'store_maintenance';

export interface FinanceEntry {
  id: string;
  companyId: string;
  entryType: 'income' | 'expense';
  expenseCategory: ExpenseCategory | null;
  amount: number;
  note: string;
  productId: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyFinancePoint {
  month: string;
  selling: number;
  buying: number;
  staffSalary: number;
  storeMaintenance: number;
  expenses: number;
  net: number;
}

export interface FinanceSummary {
  totals: {
    income: number;
    expenses: number;
    net: number;
    staffSalary: number;
    productBuying: number;
    storeMaintenance: number;
  };
  monthly: MonthlyFinancePoint[];
}
