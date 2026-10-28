import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  ExpenseCategory,
  FinanceEntry,
  FinanceSummary,
  Person,
  PersonPayload,
  PersonType,
  Product,
  ProductPayload,
} from '../types/erp';
import { ApiError } from './apiError';
import { httpClient } from './httpClient';

class ErpApi {
  constructor(private readonly client: AxiosInstance) {}

  listPeople(personType?: PersonType): Promise<Person[]> {
    return this.unwrap(
      this.client.get<Person[]>('/people', { params: personType ? { personType } : undefined }),
    );
  }

  createPerson(payload: PersonPayload): Promise<Person> {
    return this.unwrap(this.client.post<Person>('/people', payload));
  }

  updatePerson(id: string, payload: Partial<PersonPayload>): Promise<Person> {
    return this.unwrap(this.client.patch<Person>(`/people/${id}`, payload));
  }

  deletePerson(id: string): Promise<void> {
    return this.unwrap(this.client.delete(`/people/${id}`));
  }

  listProducts(): Promise<Product[]> {
    return this.unwrap(this.client.get<Product[]>('/products'));
  }

  createProduct(payload: ProductPayload): Promise<Product> {
    return this.unwrap(this.client.post<Product>('/products', payload));
  }

  updateProduct(id: string, payload: Partial<ProductPayload>): Promise<Product> {
    return this.unwrap(this.client.patch<Product>(`/products/${id}`, payload));
  }

  uploadProductImage(id: string, file: File): Promise<Product> {
    const body = new FormData();
    body.append('image', file);
    return this.unwrap(this.client.post<Product>(`/products/${id}/image`, body));
  }

  deleteProduct(id: string): Promise<void> {
    return this.unwrap(this.client.delete(`/products/${id}`));
  }

  listFinance(): Promise<FinanceEntry[]> {
    return this.unwrap(this.client.get<FinanceEntry[]>('/finance'));
  }

  financeSummary(): Promise<FinanceSummary> {
    return this.unwrap(this.client.get<FinanceSummary>('/finance/summary'));
  }

  addIncome(payload: { amount: number; note?: string; productId?: string; occurredAt?: string }): Promise<FinanceEntry> {
    return this.unwrap(this.client.post<FinanceEntry>('/finance/income', payload));
  }

  addExpense(payload: {
    category: ExpenseCategory;
    amount: number;
    note?: string;
    productId?: string;
    occurredAt?: string;
  }): Promise<FinanceEntry> {
    return this.unwrap(this.client.post<FinanceEntry>('/finance/expenses', payload));
  }

  deleteFinance(id: string): Promise<void> {
    return this.unwrap(this.client.delete(`/finance/${id}`));
  }

  private async unwrap<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      return (await request).data;
    } catch (error) {
      throw ApiError.from(error);
    }
  }
}

export const erpApi = new ErpApi(httpClient);
