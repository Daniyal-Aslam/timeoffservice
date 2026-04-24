import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

const store = new Map<string, any>();

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const idempotencyKey = request.headers['idempotency-key'];

    if (!idempotencyKey) {
      return next.handle();
    }

    // If already processed → return cached response
    if (store.has(idempotencyKey)) {
      return of(store.get(idempotencyKey));
    }

    return next.handle().pipe(
      tap((response) => {
        store.set(idempotencyKey, response);

        // Optional: TTL cleanup (simple version)
        setTimeout(() => {
          store.delete(idempotencyKey);
        }, 5 * 60 * 1000); // 5 min
      }),
    );
  }
}