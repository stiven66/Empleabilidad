import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { Vacancy } from './entities/vacancy.entity';
import { Technology } from './entities/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy, Technology])],
  providers: [VacanciesService],
  controllers: [VacanciesController],
  exports: [VacanciesService],
})
export class VacanciesModule {}
