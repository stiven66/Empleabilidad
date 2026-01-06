import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(name: string, email: string, password: string) { //Este metodo crea un nuevo usuario con contraseña encriptada
    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ name, email, password: hash });
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email); //buscamos al usuario en la base de datos por su correo.
    if (!user || !(await bcrypt.compare(password, user.password))) { //Comparamos contraseñas tras encontrar el usaurio en DB
      throw new UnauthorizedException('Contraseña incorrecta');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, { expiresIn: '1d' }); //Creamos un token JWT que dura un dia.
    return { access_token };   //Devolvemos el token para que se use en las peticiones
  }
}
