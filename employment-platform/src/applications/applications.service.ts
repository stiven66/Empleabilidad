import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';

@Injectable()
export class ApplicationsService {
  constructor(    //Trabajamos con las tablas de postulaciones y vacantes de nuestra DB 
    @InjectRepository(Application) private appRepo: Repository<Application>,
    @InjectRepository(Vacancy) private vacancyRepo: Repository<Vacancy>,
  ) {}

  async countByVacancy(vacancyId: number) {  //Cuenta cuantos usuarios se han postulado y para saber si hay cupos
    return this.appRepo.count({ where: { vacancyId } });
  }

  async countActiveByUser(userId: number) {
    // cuenta cuantas vacantes tiene activa el usuario para limitar a maximo 3 al mismo tiempo
    const qb = this.appRepo.createQueryBuilder('a')
      .innerJoin('a.vacancy', 'v')
      .where('a.userId = :userId', { userId })
      .andWhere('v.active = true');
    return qb.getCount();
  }

  async apply(userId: number, vacancyId: number) {
    const vacancy = await this.vacancyRepo.findOne({ where: { id: vacancyId } });  //Verifica que la vacante exista y esté activa.
    if (!vacancy || !vacancy.active) throw new NotFoundException('Vacante no disponible'); //Si no esta activa 

    const already = await this.appRepo.findOne({ where: { userId, vacancyId } }); //Revisa que el usuario no se haya postulado antes.
    if (already) throw new BadRequestException('Ya estás postulado a esta vacante');

    const applicants = await this.countByVacancy(vacancyId);
    if (applicants >= vacancy.maxApplicants) {   //Verifica que la vacante tenga cupos disponibles 
      throw new BadRequestException('Cupo completo, no se aceptan más postulaciones');
    }

    const userActiveCount = await this.countActiveByUser(userId);
    if (userActiveCount >= 3) {  //Si el usuario tiene 3 activas no lo deja postular a mas vacantes
      throw new BadRequestException('Has alcanzado el límite de 3 vacantes activas');
    }

    const app = this.appRepo.create({ userId, vacancyId }); //Si todo esta bien crea la vacante
    return this.appRepo.save(app); //La guarda
  }

  async listByVacancy(vacancyId: number) {
    return this.appRepo.find({ where: { vacancyId }, relations: ['user', 'vacancy'] }); //Enlista los usarios totales de una vacante
  }

  async listByUser(userId: number) {
    return this.appRepo.find({ where: { userId }, relations: ['vacancy'] }); //Enlista todas las vacantes de un usuario 
  }
}
