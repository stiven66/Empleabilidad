import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}   //Trabajamos con la tabla de usuarios de la DB

  async create(data: Partial<User>) {
    const exists = await this.repo.findOne({ where: { email: data.email } });    //Buscamos si ya existe un usuario con ese correo
    if (exists) throw new ConflictException('Email ya registrado! Intenta con otro.');
    return this.repo.save(this.repo.create(data));    //Si no existe creamos el usuario y lo guardamos en la base de datos.
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });  //Busca un usuario en DB por su correo.
  }

  async assignRole(userId: number, role: UserRole) { //Metodo para cuando el administrador quiera cambiar de rol cualquier usuario
    await this.repo.update({ id: userId }, { role }); //Se busca un usuario y le cambia el rol
    return this.repo.findOne({ where: { id: userId } });  //Desps lo devuelve con su rol ya actualizado 
  }
}
