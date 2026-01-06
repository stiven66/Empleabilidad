import { Column, CreateDateColumn, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Technology } from './technology.entity';

export type Modality = 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL';

@Entity()
export class Vacancy {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column({ type: 'text' }) description: string;
  @Column() seniority: string;
  @Column() softSkills: string;
  @Column() location: string; // Medellín, Bogotá, etc.
  @Column({ type: 'enum', enum: ['REMOTO', 'HIBRIDO', 'PRESENCIAL'] }) modality: Modality;
  @Column() salaryRange: string;
  @Column() company: string;
  @Column({ type: 'int' }) maxApplicants: number;
  @Column({ default: true }) active: boolean;

  @ManyToMany(() => Technology, { cascade: true })
  @JoinTable()
  technologies: Technology[];

  @CreateDateColumn() createdAt: Date;
}
