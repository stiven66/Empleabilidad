import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from 'src/common/decorators/roles.decorators'; //Metadatos de roles
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [   //Guarda la lista de roles
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true; //Si el endpoint no tiene @Roles permite el acceso

    const { user } = context.switchToHttp().getRequest();
    if (!user || !requiredRoles.includes(user.role)) { //Si no hay usuario autenticado o no coincide el role niega el acceso 
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
//Este codigo es mi filtro de seguridad que revisa si el usuario que hace la peticion tiene el rol correcto para acceder al endpoint.
