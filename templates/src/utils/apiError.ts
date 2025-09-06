// src/utils/ApiError.ts
import { Request } from 'express';

/**
 * SubError structure (commonly used for validation errors).
 */
export interface SubError {
  field?: string;
  message: string;
  code?: string;
}

/**
 * Standard API Error class used across the application.
 * Inspired by patterns used in large-scale systems.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;
  public readonly subErrors?: SubError[];
  public readonly timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    options?: {
      isOperational?: boolean;
      details?: unknown;
      subErrors?: SubError[];
    }
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.details = options?.details;
    this.subErrors = options?.subErrors;
    this.timestamp = new Date().toISOString();

    // Ensures proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Factory method for validation errors.
   */
  static validationError(errors: SubError[]): ApiError {
    return new ApiError(400, 'Validation Error', {
      subErrors: errors,
    });
  }

  /**
   * Convert error into safe JSON response for clients.
   */
  toJSON(req?: Request) {
    return {
      status: 'error',
      statusCode: this.statusCode,
      message: this.message,
      path: req?.originalUrl,
      timestamp: this.timestamp,
      details: this.details,
      errors: this.subErrors,
    };
  }
}
