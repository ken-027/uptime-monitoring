/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod/v4';
import { RequestHandlerError } from './request-handler.error';

type Handler<T = any> = (req: NextRequest, ctx: { params: T }) => Promise<NextResponse>;

export function withErrorWrapper<TParams = any>(handler: Handler<TParams>) {
  return async function (req: NextRequest, ctx: { params: TParams }): Promise<NextResponse> {
    try {
      return await handler(req, ctx);
    } catch (err: any) {
      let status = err?.status || 500;
      let errors: { message: string; field?: string }[] = [];

      if (err instanceof ZodError) {
        status = 400;
        errors = err.issues.map((issue) => ({
          message: issue.message,
          field: issue.path[0] as string,
        }));
      } else if (err instanceof RequestHandlerError) {
        status = err.statusCode;
        errors = [{ message: err.message }];
      } else {
        errors = [{ message: err.message ?? 'Internal Server Error' }];
      }
      return NextResponse.json({ errors }, { status });
    }
  };
}
