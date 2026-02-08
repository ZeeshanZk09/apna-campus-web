/**
 * Standardized API response utilities.
 * Use these to ensure consistent response format across all API routes.
 */

import { NextResponse } from "next/server";

interface SuccessResponseOptions<T> {
  data?: T;
  message?: string;
  metadata?: Record<string, unknown>;
  status?: number;
}

interface ErrorResponseOptions {
  error: string;
  details?: unknown;
  status?: number;
}

interface PaginatedResponseOptions<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

/**
 * Return a standardized success response.
 */
export function successResponse<T>(options: SuccessResponseOptions<T>) {
  const { data, message = "Success", metadata, status = 200 } = options;
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(metadata && { metadata }),
    },
    { status },
  );
}

/**
 * Return a standardized error response.
 */
export function errorResponse(options: ErrorResponseOptions) {
  const { error, details, status = 500 } = options;
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details !== undefined ? { details } : {}),
    },
    { status },
  );
}

/**
 * Return a paginated response with metadata.
 */
export function paginatedResponse<T>(options: PaginatedResponseOptions<T>) {
  const { data, total, page, limit, message = "Success" } = options;
  return NextResponse.json({
    success: true,
    message,
    data,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

/**
 * Parse pagination params from URL search params.
 */
export function parsePagination(url: URL): {
  page: number;
  limit: number;
  search: string;
} {
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)),
  );
  const search = url.searchParams.get("search") || "";
  return { page, limit, search };
}
