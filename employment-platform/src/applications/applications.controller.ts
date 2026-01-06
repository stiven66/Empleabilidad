import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ApiHeader, ApiTags, ApiBearerAuth, ApiSecurity} from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';

@ApiTags('applications')    //Agrupamos en swagger
@ApiHeader({ name: 'x-api-key', required: true })  //Incluimos la clave api-key
@UseGuards(ApiKeyGuard)   //Validamos la api-key
@ApiBearerAuth('BearerAuth') 
@ApiSecurity('x-api-key')
@Controller('applications')
export class ApplicationsController {
  constructor(private service: ApplicationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CODER', 'ADMIN')   //Solo se pueden postular a vacantes CODER o ADMIn
  @Post()  //METODO POST 
  apply(@Req() req: any, @Body() dto: CreateApplicationDto) {
    return this.service.apply(req.user.userId, dto.vacancyId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR', 'ADMIN')   //Solo gestores y admins pueden ver quiénes se postularon a x vacante
  @Get('vacancy/:id')   //METODO GET por id
  listByVacancy(@Param('id') id: number) {
    return this.service.listByVacancy(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CODER', 'ADMIN')
  @Get('me')   //Puede ver sus propias postulaciones 
  listMine(@Req() req: any) {
    return this.service.listByUser(req.user.userId);
  }
}
