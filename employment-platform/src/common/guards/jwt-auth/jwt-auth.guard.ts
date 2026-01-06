import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

//Lee el token JWT del header Authorization, valida que el token sea correcto y adjuntar la información del usuario al objeto request (payload).
//Se usa con el decorador @UseGuards(JwtAuthGuard) en los endpoints.