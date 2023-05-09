import { Schema, Document, Model } from 'mongoose';


export interface IPaginateOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
  populate?: string
}

export interface IQueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export const createEmptyQueryResult = (): IQueryResult => ({
  results: [],
  page: 0,
  limit: 0,
  totalPages: 0,
  totalResults: 0,
});