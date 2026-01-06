import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   //Extraemos el token del encabezado 
      ignoreExpiration: false,    //Si el token ya vencio no lo aceptamos
      secretOrKey: process.env.JWT_SECRET,    //Esta es la clave para comprobar que el token es valido 
    });
  }

  async validate(payload: { sub: number; email: string; role: string }) {  //Si el token pasa devolvemos el payload 
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}

//Queda disponible en el request y podamos saber quién es el usuario y qué permisos tiene.

//Flujo
//El usuario hace una petición, trae un token en la cabecera, el guardia (JwtStrategy) revisa el token con la clave secreta.
//Si el token es válido y no está vencido, abre el token y saca los datos del usuario.
//Esos datos se pasan al resto de la aplicación para que sepamos quién está haciendo la petición y qué puede hacer.