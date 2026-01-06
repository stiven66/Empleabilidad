import { Test } from '@nestjs/testing';
import { ApplicationsService } from 'src/applications/applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from 'src/applications/entities/application.entity';
import { Vacancy } from 'src/vacancies/entities/vacancy.entity';
import { Repository } from 'typeorm';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let appRepo: Repository<Application>;
  let vacancyRepo: Repository<Vacancy>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: getRepositoryToken(Application), useClass: Repository },
        { provide: getRepositoryToken(Vacancy), useClass: Repository },
      ],
    }).compile();

    service = module.get(ApplicationsService);
    appRepo = module.get(getRepositoryToken(Application));
    vacancyRepo = module.get(getRepositoryToken(Vacancy));
  });

  it('rechaza postulación cuando el cupo está completo', async () => {
    jest.spyOn(vacancyRepo, 'findOne').mockResolvedValue({ id: 1, maxApplicants: 1, active: true } as any);
    jest.spyOn(appRepo, 'findOne').mockResolvedValue(null);
    jest.spyOn(service, 'countByVacancy').mockResolvedValue(1);

    await expect(service.apply(1, 1)).rejects.toThrow('Cupo completo, no se aceptan más postulaciones');
  });

  it('rechaza postulación duplicada', async () => {
    jest.spyOn(vacancyRepo, 'findOne').mockResolvedValue({ id: 1, maxApplicants: 2, active: true } as any);
    jest.spyOn(appRepo, 'findOne').mockResolvedValue({ id: 1 } as any);

    await expect(service.apply(1, 1)).rejects.toThrow('Ya estás postulado a esta vacante');
  });

  it('rechaza más de tres vacantes activas', async () => {
    jest.spyOn(vacancyRepo, 'findOne').mockResolvedValue({ id: 1, maxApplicants: 2, active: true } as any);
    jest.spyOn(appRepo, 'findOne').mockResolvedValue(null);
    jest.spyOn(service, 'countByVacancy').mockResolvedValue(0);
    jest.spyOn(service, 'countActiveByUser').mockResolvedValue(3);

    await expect(service.apply(1, 1)).rejects.toThrow('Has alcanzado el límite de 3 vacantes activas');
  });
});
