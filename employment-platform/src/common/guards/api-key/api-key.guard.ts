import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('No puedes pasar!');
    }
    return true;
  }
}

//Este seria el portero de entrada pregunta si traigo la llave osea la APIkey para dejar ejecutar los endpoint
//El cliente hace una peticion a un endpoint, el guard revisa el header x-api-key, si no hay llave o la llave no coincide 
//con la que se definio en variables de entorno (process.env.API_KEY), lanza un error de UnauthorizedException que dice: “No puedes pasar”.