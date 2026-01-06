import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';

@Entity()
@Unique(['userId', 'vacancyId'])
export class Application {
  @PrimaryGeneratedColumn() id: number;
  @Column() userId: number;
  @Column() vacancyId: number;

  @ManyToOne(() => User) user: User;
  @ManyToOne(() => Vacancy) vacancy: Vacancy;

  @CreateDateColumn() appliedAt: Date;
}

