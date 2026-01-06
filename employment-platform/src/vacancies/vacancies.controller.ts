import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ApiHeader, ApiTags, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { ToggleActiveDto } from 'src/vacancies/dto/toggle.dto';

@ApiTags('vacancies')    //Agrupa en swagger
@ApiHeader({ name: 'x-api-key', required: true })   //Incluye la calve api-key
@ApiBearerAuth('BearerAuth') 
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)    //Guard que valida api-key
@Controller('vacancies')
export class VacanciesController {
  constructor(private service: VacanciesService) {}

  @Get()     //METODO GET filtra por tecnologia y para senior
  findAll(@Query('technology') technology?: string, @Query('seniority') seniority?: string) {
    return this.service.findAll({ technology, seniority });    //LLama al servicio y muestra las que cumplen esos filtros
  }

  @Get(':id')    //METODO GET busca vacante por id 
  findOne(@Param('id') id: number) {
    return this.service.findOne(Number(id));   //Devuelve vacante con sus tecnologias 
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR')   //Solo administrador o gestor pueden crear nuevas vacantes
  @Post()    //METODO POST 
  create(@Body() dto: CreateVacancyDto) {
    return this.service.create(dto);   //Llama servicio para crear nueva vacante en DB
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR')   //Solo administrador o gestor pueden actualizar vacantes
  @Patch(':id')   //Busca por id para actualizar ya existentes
  update(@Param('id') id: number, @Body() dto: UpdateVacancyDto) {
    return this.service.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'GESTOR')   //Actuliza el campo active, solo pueden ADMIN  oGESTOR acceder a este endpoint
  @Patch(':id/active')
  toggleActive(@Param('id') id: number, @Body() dto: ToggleActiveDto) {
    return this.service.activate(Number(id), dto.active);
  }
}
