import { Test } from '@nestjs/testing';
import { VacanciesService } from 'src/vacancies/vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy } from 'src/vacancies/entities/vacancy.entity';
import { Technology } from 'src/vacancies/entities/technology.entity';
import { Repository } from 'typeorm';

describe('VacanciesService', () => {
  let service: VacanciesService;
  let vacancyRepo: Repository<Vacancy>;
  let techRepo: Repository<Technology>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VacanciesService,
        { provide: getRepositoryToken(Vacancy), useClass: Repository },
        { provide: getRepositoryToken(Technology), useClass: Repository },
      ],
    }).compile();

    service = module.get(VacanciesService);
    vacancyRepo = module.get(getRepositoryToken(Vacancy));
    techRepo = module.get(getRepositoryToken(Technology));
  });

  it('no permite crear vacante sin cupo máximo', async () => {
    await expect(
      service.create({
        title: 'Dev',
        description: 'Desc',
        seniority: 'Junior',
        softSkills: 'Comunicacion',
        location: 'Medellín',
        modality: 'REMOTO',
        salaryRange: '3-4M',
        company: 'Acme',
        maxApplicants: 0,
        technologies: ['Node.js'],
      } as any),
    ).rejects.toThrow('Debe definir un cupo máximo >= 1');
  });
});
