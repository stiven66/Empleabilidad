import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: 'Operación exitosa',
      })),
    );
  }
}
 //De manera global para todos los endpoints si este funciona, manda un objeto con un breve mensaje de "Operacion exitosa"