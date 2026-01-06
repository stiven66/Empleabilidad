import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Technology } from './entities/technology.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(    //Trabajamos con las tablas de vacantes y tecnologias de la DB
    @InjectRepository(Vacancy) private vacancyRepo: Repository<Vacancy>,
    @InjectRepository(Technology) private techRepo: Repository<Technology>,
  ) {}

  async create(dto: CreateVacancyDto) {   
    if (!dto.maxApplicants || dto.maxApplicants < 1) {  //Valida que el número máximo de postulantes sea al menos 1.
      throw new BadRequestException('Debe definir un cupo máximo >= 1');
    }
    const technologies = await Promise.all(
      (dto.technologies || []).map(async (name) => {  //Si alguna vacante no existe en la base de datos, la crea. Si ya existe la reutiliza
        let tech = await this.techRepo.findOne({ where: { name } });
        if (!tech) tech = await this.techRepo.save(this.techRepo.create({ name }));
        return tech;
      }),
    );

    const vacancy = this.vacancyRepo.create({ ...dto, technologies });  //Crea la vacante con sus datos y las tecnologías asociadas.
    return this.vacancyRepo.save(vacancy);  //Por ultimo la guiarda en la base de datos
  }

  async findAll(filters?: { technology?: string; seniority?: string }) {
    const qb = this.vacancyRepo.createQueryBuilder('vacancy')
      .leftJoinAndSelect('vacancy.technologies', 'technology')
      .where('vacancy.active = :active', { active: true });  //Busca las vacantes activas

      //Filtra las vacantes por tecnologia o para Senior
    if (filters?.technology) {
      qb.andWhere('technology.name ILIKE :tech', { tech: `%${filters.technology}%` });
    }
    if (filters?.seniority) {
      qb.andWhere('vacancy.seniority ILIKE :sen', { sen: `%${filters.seniority}%` });
    }
    return qb.getMany();  //Devuelve la lista de vacantes que cumplen esas condiciones.
  }

  async findOne(id: number) {
    const vacancy = await this.vacancyRepo.findOne({
      where: { id },    //Busca una vacante por su id.
      relations: ['technologies'],   //Incluye las tecnologías relacionadas.
    });
    if (!vacancy) throw new NotFoundException('Vacante no encontrada');
    return vacancy;   //Retorna la vacante
  }

  async update(id: number, dto: UpdateVacancyDto) {
    const vacancy = await this.findOne(id);     //Busca por id vacante
    if (dto.technologies) {
      const technologies = await Promise.all(
        dto.technologies.map(async (name) => {    //Si dto trae nueva tecnologia las procesa igual que en creatre
          let tech = await this.techRepo.findOne({ where: { name } });
          if (!tech) tech = await this.techRepo.save(this.techRepo.create({ name }));
          return tech;
        }),
      );
      Object.assign(vacancy, { ...dto, technologies }); //actualiza con los nuevos datos
    } else {
      Object.assign(vacancy, dto);
    }
    return this.vacancyRepo.save(vacancy);  //Guarda los cambios en DB 
  }

  async activate(id: number, active: boolean) {
    const vacancy = await this.findOne(id);   //Busca por id 
    vacancy.active = active;     //Cambia su estado de activa/inactiva
    return this.vacancyRepo.save(vacancy);   //guarda en DB
  }
}
