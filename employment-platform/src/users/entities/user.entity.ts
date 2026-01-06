import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export type UserRole = 'ADMIN' | 'GESTOR' | 'CODER';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column() email: string;
  @Column() password: string;
  @Column({ type: 'enum', enum: ['ADMIN', 'GESTOR', 'CODER'], default: 'CODER' }) role: UserRole;
}
