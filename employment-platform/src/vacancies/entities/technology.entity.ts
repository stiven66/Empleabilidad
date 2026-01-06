import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Vacancy } from 'src/vacancies/entities/vacancy.entity';

@Entity()
export class Technology {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) name: string;

  @ManyToMany(() => Vacancy, (vacancy) => vacancy.technologies)
  vacancies: Vacancy[];
}
