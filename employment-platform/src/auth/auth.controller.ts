import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';

@ApiTags('auth')   //Documentar swagger
@ApiHeader({ name: 'x-api-key', required: true })  //Debe incluir la llave de seguridad API-key
@UseGuards(ApiKeyGuard)    //Guardia que revisa si trae esa api-key
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')    //Metodo POST 
  register(@Body() dto: RegisterDto) {    //Recibe el dto 
    return this.authService.register(dto.name, dto.email, dto.password);  //LLama al servicio para registrar el usuario
  }
 
  @Post('login')    //Metodo POST 
  login(@Body() dto: LoginDto) {    //Recibe el dto 
    return this.authService.login(dto.email, dto.password);   //LLama al servicio para validar y devolver el token
  }
}
