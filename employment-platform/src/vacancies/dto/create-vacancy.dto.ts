import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateVacancyDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() description: string;
  @IsString() @IsOptional() seniority: string;
  @IsString() @IsNotEmpty() softSkills: string;
  @IsString() @IsNotEmpty() location: string;
  @IsEnum(['REMOTO', 'HIBRIDO', 'PRESENCIAL']) modality: 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL';
  @IsString() @IsNotEmpty() salaryRange: string;
  @IsString() @IsNotEmpty() company: string;
  @IsInt() @Min(1) maxApplicants: number;
  @IsArray() @IsOptional() technologies: string[];
  @IsOptional() @IsBoolean() active?: boolean;
}
