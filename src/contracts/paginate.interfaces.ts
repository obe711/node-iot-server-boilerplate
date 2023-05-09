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